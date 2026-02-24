import { ordersService, settingsService } from './services/api.js';
import { cartManager, toastManager, formatCurrency, validateEmail, validatePhone } from './utils.js';

function initializeCart() {
  const cart = cartManager.getCart();

  if (cart.length === 0) {
    document.getElementById('emptyCart').style.display = 'block';
    document.getElementById('cartContent').style.display = 'none';
    return;
  }

  document.getElementById('cartContent').style.display = 'block';
  displayCartItems(cart);
  updateSummary();
}

function displayCartItems(cart) {
  const tbody = document.getElementById('cartItemsList');
  tbody.innerHTML = '';

  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${formatCurrency(item.price)}</td>
      <td><input type="number" value="${item.quantity}" min="1" style="width: 60px;" onchange="updateQuantity(${item.product_id}, this.value)"></td>
      <td>${formatCurrency(item.price * item.quantity)}</td>
      <td><button class="btn-small" onclick="removeItem(${item.product_id})">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateQuantity(productId, quantity) {
  cartManager.updateQuantity(productId, parseInt(quantity));
  initializeCart();
}

function removeItem(productId) {
  cartManager.removeItem(productId);
  initializeCart();
}

async function updateSummary() {
  try {
    const cart = cartManager.getCart();
    const subtotal = cartManager.getTotal();
    const shippingData = await settingsService.getShippingCost();
    const shipping = shippingData.shipping_cost || 10;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);
  } catch (error) {
    console.error('Error updating summary:', error);
  }
}

// Handle checkout form
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const customer_name = formData.get('customer_name');
  const customer_email = formData.get('customer_email');
  const customer_phone = formData.get('customer_phone');
  const customer_address = formData.get('customer_address');

  // Validate
  if (!validateEmail(customer_email)) {
    toastManager.error('Email inválido');
    return;
  }

  if (!validatePhone(customer_phone)) {
    toastManager.error('Teléfono inválido');
    return;
  }

  try {
    const cart = cartManager.getCart();
    const shippingData = await settingsService.getShippingCost();
    const shipping = shippingData.shipping_cost || 10;

    const orderData = {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items: cart,
      subtotal: cartManager.getTotal(),
      shipping_cost: shipping,
      total_price: cartManager.getTotal() + shipping,
    };

    const response = await ordersService.create(orderData);

    document.getElementById('orderId').textContent = response.order_id;
    document.getElementById('successModal').style.display = 'flex';

    cartManager.clear();
    initializeCart();
  } catch (error) {
    console.error('Error creating order:', error);
    toastManager.error('Error al procesar la compra');
  }
});

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// Initialize on page load
window.addEventListener('load', initializeCart);

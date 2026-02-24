import { productsService } from './services/api.js';
import { cartManager, toastManager, formatCurrency } from './utils.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function loadProduct() {
  try {
    const product = await productsService.getById(productId);

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = product.category_name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = formatCurrency(product.price);
    document.getElementById('productStock').textContent = product.stock > 0
      ? `${product.stock} disponibles`
      : 'Agotado';
    document.getElementById('productImage').src = product.image_url || 'https://via.placeholder.com/400x500';

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    quantityInput.max = product.stock;

    document.getElementById('decreaseQty').addEventListener('click', () => {
      if (quantityInput.value > 1) quantityInput.value--;
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
      if (quantityInput.value < product.stock) quantityInput.value++;
    });

    // Add to cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      cartManager.addItem(product, quantity);
      toastManager.success('Producto agregado al carrito');
      setTimeout(() => window.location.href = 'cart.html', 500);
    });
  } catch (error) {
    console.error('Error loading product:', error);
    toastManager.error('Producto no encontrado');
  }
}

loadProduct();

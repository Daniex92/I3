import { authService, productsService, ordersService, categoriesService, settingsService } from './services/api.js';
import { toastManager, formatCurrency } from './utils.js';

let currentToken = null;
let currentUser = null;

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const response = await authService.login(username, password);
    currentToken = response.token;
    currentUser = response.user;

    localStorage.setItem('admin_token', currentToken);
    localStorage.setItem('admin_user', JSON.stringify(currentUser));

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';

    loadDashboard();
  } catch (error) {
    toastManager.error('Credenciales inválidas');
  }
});

// Check if already logged in
function checkAuth() {
  const token = localStorage.getItem('admin_token');
  const user = localStorage.getItem('admin_user');

  if (token && user) {
    currentToken = token;
    currentUser = JSON.parse(user);

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';

    loadDashboard();
  }
}

// TAB SWITCHING
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active from all
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active to clicked
    e.target.classList.add('active');
    const tabId = e.target.dataset.tab;
    document.getElementById(tabId).classList.add('active');
  });
});

// LOAD DASHBOARD
async function loadDashboard() {
  await loadInventory();
  await loadOrders();
  await loadSettings();
}

// INVENTORY TAB
async function loadInventory() {
  try {
    // Load categories for add product form
    const categories = await categoriesService.getAll();
    const categorySelect = document.getElementById('categorySelect');

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

    // Load subcategories on category change
    categorySelect.addEventListener('change', async (e) => {
      const categoryId = e.target.value;
      const subcategorySelect = document.getElementById('subcategorySelect');
      subcategorySelect.innerHTML = '<option value="">Seleccionar...</option>';

      if (categoryId) {
        const subcategories = await categoriesService.getSubcategories(categoryId);
        subcategories.forEach(sub => {
          const option = document.createElement('option');
          option.value = sub.id;
          option.textContent = sub.name;
          subcategorySelect.appendChild(option);
        });
      }
    });

    // Load products
    const products = await productsService.getAll();
    const tbody = document.getElementById('productsList');

    products.forEach(product => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${product.stock}</td>
        <td>${product.category_name}</td>
        <td><button class="btn-small" onclick="deleteProduct(${product.id})">Eliminar</button></td>
      `;
      tbody.appendChild(tr);
    });

    // Handle add product
    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        subcategory_id: parseInt(formData.get('subcategory')),
        image_url: formData.get('image_url'),
      };

      try {
        await productsService.create(productData, currentToken);
        toastManager.success('Producto creado');
        e.target.reset();
        location.reload();
      } catch (error) {
        toastManager.error('Error al crear producto');
      }
    });
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

// ORDERS TAB
async function loadOrders() {
  try {
    const orders = await ordersService.getAll(currentToken);
    const tbody = document.getElementById('ordersList');

    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${order.id}</td>
        <td>${order.customer_name}</td>
        <td>${formatCurrency(order.total_price)}</td>
        <td>
          <select onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="Pendiente" ${order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Pagado" ${order.status === 'Pagado' ? 'selected' : ''}>Pagado</option>
            <option value="Enviado" ${order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
            <option value="Entregado" ${order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
            <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td><button class="btn-small" onclick="viewOrder(${order.id})">Ver</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

// SETTINGS TAB
async function loadSettings() {
  try {
    const data = await settingsService.getShippingCost();
    document.getElementById('shippingCost').value = data.shipping_cost || 10;

    document.getElementById('updateShippingBtn').addEventListener('click', async () => {
      try {
        const cost = document.getElementById('shippingCost').value;
        await settingsService.updateShippingCost(cost, currentToken);
        toastManager.success('Costo de envío actualizado');
      } catch (error) {
        toastManager.error('Error al actualizar');
      }
    });
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Global functions
window.deleteProduct = async (id) => {
  if (confirm('¿Eliminar producto?')) {
    try {
      await productsService.delete(id, currentToken);
      toastManager.success('Producto eliminado');
      location.reload();
    } catch (error) {
      toastManager.error('Error al eliminar');
    }
  }
};

window.updateOrderStatus = async (id, status) => {
  try {
    await ordersService.updateStatus(id, status, currentToken);
    toastManager.success('Estado actualizado');
  } catch (error) {
    toastManager.error('Error al actualizar');
  }
};

window.viewOrder = (id) => {
  alert(`Ver detalles de orden #${id}`);
};

// Initialize
checkAuth();

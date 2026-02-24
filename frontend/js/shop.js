import { productsService, categoriesService } from './services/api.js';
import { toastManager, formatCurrency } from './utils.js';

let currentPage = 1;
let allProducts = [];

// Load categories and products
async function initialize() {
  try {
    await loadCategories();
    await loadProducts();
  } catch (error) {
    console.error('Initialization error:', error);
    toastManager.error('Error cargando la tienda');
  }
}

async function loadCategories() {
  try {
    const categories = await categoriesService.getAll();
    const categorySelect = document.getElementById('categoryFilter');

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

    // Load subcategories on category change
    categorySelect.addEventListener('change', async (e) => {
      const categoryId = e.target.value;
      const subcategorySelect = document.getElementById('subcategoryFilter');
      subcategorySelect.innerHTML = '<option value="">Todas</option>';

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
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadProducts() {
  try {
    allProducts = await productsService.getAll();
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    toastManager.error('Error cargando productos');
  }
}

function displayProducts(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos disponibles</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('a');
    card.href = `product-detail.html?id=${product.id}`;
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image_url || 'https://via.placeholder.com/280x350'}" alt="${product.name}">
      </div>
      <div class="product-body">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-category">${product.subcategory_name}</p>
        <p class="product-price">${formatCurrency(product.price)}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Apply filters
document.getElementById('applyFilters').addEventListener('click', () => {
  const filters = {
    category: document.getElementById('categoryFilter').value,
    subcategory: document.getElementById('subcategoryFilter').value,
    minPrice: document.getElementById('minPrice').value,
    maxPrice: document.getElementById('maxPrice').value,
    search: document.getElementById('searchInput').value,
    sort: document.getElementById('sortFilter').value,
  };

  const filtered = allProducts.filter(product => {
    if (filters.category && product.category_id != filters.category) return false;
    if (filters.subcategory && product.subcategory_id != filters.subcategory) return false;
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  displayProducts(filtered);
});

initialize();

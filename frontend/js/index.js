import { productsService } from './services/api.js';
import { cartManager, toastManager, formatCurrency } from './utils.js';

// Load featured products on index page
async function loadFeaturedProducts() {
  try {
    const products = await productsService.getAll({ sort: 'newest' });
    const featured = products.slice(0, 3);
    const grid = document.getElementById('featuredProducts');

    featured.forEach(product => {
      const card = createProductCard(product);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

function createProductCard(product) {
  const a = document.createElement('a');
  a.href = `product-detail.html?id=${product.id}`;
  a.className = 'product-card';

  a.innerHTML = `
    <div class="product-image">
      <img src="${product.image_url || 'https://via.placeholder.com/280x350'}" alt="${product.name}">
    </div>
    <div class="product-body">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-category">${product.category_name}</p>
      <p class="product-price">${formatCurrency(product.price)}</p>
    </div>
  `;

  return a;
}

loadFeaturedProducts();

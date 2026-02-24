// CART MANAGER
export class CartManager {
  constructor() {
    this.STORAGE_KEY = 'raiz_cart';
    this.EXPIRATION_KEY = 'raiz_cart_expiry';
    this.EXPIRATION_TIME = 32 * 60 * 60 * 1000; // 32 hours
    this.listeners = [];
    this.initCart();
  }

  initCart() {
    const expiryTime = localStorage.getItem(this.EXPIRATION_KEY);
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      this.clear();
    }
  }

  getCart() {
    const cart = localStorage.getItem(this.STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    localStorage.setItem(this.EXPIRATION_KEY, (Date.now() + this.EXPIRATION_TIME).toString());
    this.notifyListeners();
  }

  addItem(product, quantity = 1) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url,
      });
    }

    this.saveCart(cart);
  }

  removeItem(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.product_id !== productId);
    this.saveCart(cart);
  }

  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.product_id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart(cart);
      }
    }
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.notifyListeners();
  }

  getTotal() {
    return this.getCart().reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCount() {
    return this.getCart().reduce((count, item) => count + item.quantity, 0);
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getCart()));
  }
}

// TOAST MANAGER
export class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  info(message) {
    this.show(message, 'info');
  }
}

// UTILITY FUNCTIONS
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount);
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone) {
  const regex = /^[\d\s\-\+\(\)]{7,20}$/;
  return regex.test(phone);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CO');
}

// Initialize cart and toast globally
export const cartManager = new CartManager();
export const toastManager = new ToastManager();

// Update cart count on all pages
function updateCartCount() {
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(badge => {
    badge.textContent = cartManager.getCount();
  });
}

// Subscribe to cart changes
cartManager.subscribe(() => {
  updateCartCount();
});

// Initial update
updateCartCount();

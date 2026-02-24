const API_BASE_URL = 'http://localhost:3000/api';

// AUTH SERVICE
export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  async verify(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Verification failed');
    return response.json();
  },
};

// PRODUCTS SERVICE
export const productsService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  async create(product, token) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async update(id, data, token) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async delete(id, token) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },
};

// CATEGORIES SERVICE
export const categoriesService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/products/categories/all`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getSubcategories(categoryId) {
    const response = await fetch(`${API_BASE_URL}/products/categories/${categoryId}/subcategories`);
    if (!response.ok) throw new Error('Failed to fetch subcategories');
    return response.json();
  },
};

// ORDERS SERVICE
export const ordersService = {
  async create(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async getAll(token) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getById(id, token) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Order not found');
    return response.json();
  },

  async updateStatus(id, status, token) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },
};

// SETTINGS SERVICE
export const settingsService = {
  async getShippingCost() {
    const response = await fetch(`${API_BASE_URL}/settings/shipping-cost`);
    if (!response.ok) throw new Error('Failed to fetch shipping cost');
    return response.json();
  },

  async updateShippingCost(cost, token) {
    const response = await fetch(`${API_BASE_URL}/settings/shipping-cost`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ shipping_cost: cost }),
    });
    if (!response.ok) throw new Error('Failed to update shipping cost');
    return response.json();
  },
};

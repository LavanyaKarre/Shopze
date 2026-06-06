import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach the JWT token to every request automatically
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ---- Auth ----
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ---- Products ----
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// ---- Cart ----
export const fetchCart = () => API.get('/cart');
export const addToCartApi = (productId, quantity = 1) => API.post('/cart', { productId, quantity });
export const updateCartQty = (productId, quantity) => API.put('/cart', { productId, quantity });
export const removeCartItem = (productId) => API.delete(`/cart/${productId}`);
export const clearCartApi = () => API.delete('/cart/clear');

// ---- Orders ----
export const placeOrder = (data) => API.post('/orders', data);
export const fetchMyOrders = () => API.get('/orders/myorders');
export const fetchOrder = (id) => API.get(`/orders/${id}`);

// ---- Admin ----
export const fetchStats = () => API.get('/admin/stats');
export const fetchAllOrders = () => API.get('/admin/orders');
export const updateOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { status });
export const fetchAllUsers = () => API.get('/admin/users');
export const fetchSettings = () => API.get('/admin/settings');
export const updateSettings = (data) => API.put('/admin/settings', data);

export default API;

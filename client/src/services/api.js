import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
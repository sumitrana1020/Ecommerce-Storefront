import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ecommerce-storefront-0cfa.onrender.com/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const getProductsByCategory = (category) => API.get(`/products/category/${category}`);
export const searchProducts = (name) => API.get(`/products/search?name=${name}`);

// Auth
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Cart
export const getCart = (userId) => API.get(`/cart/${userId}`);
export const addToCart = (data) => API.post('/cart/add', data);
export const updateCartItem = (cartItemId, quantity) => API.put(`/cart/${cartItemId}`, { quantity });
export const removeFromCart = (cartItemId) => API.delete(`/cart/${cartItemId}`);
export const clearCart = (userId) => API.delete(`/cart/clear/${userId}`);

// Orders
export const placeOrder = (userId) => API.post(`/orders/place/${userId}`);
export const getUserOrders = (userId) => API.get(`/orders/user/${userId}`);
export const cancelOrder = (orderId) => API.put(`/orders/${orderId}/status`, { status: "CANCELLED" });
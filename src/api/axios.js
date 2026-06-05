import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User/auth API — base is /api/user
const API = axios.create({
  baseURL: `${BASE_URL}/user`,
  headers: { 'Content-Type': 'application/json' },
});

// General API — for products, cart, wishlist, orders
export const GAPI = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token to every request ──────────────────
const attachToken = (config) => {
  const token = localStorage.getItem('groceriaToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

API.interceptors.request.use(attachToken);
GAPI.interceptors.request.use(attachToken);

// ── Response interceptor: handle 401 (expired / invalid token) ──────────────
const handle401 = (error) => {
  if (error.response?.status === 401) {
    // Clear all stale auth and cart data
    localStorage.removeItem('groceriaToken');
    localStorage.removeItem('groceriaUser');
    localStorage.removeItem('groceriaCart');
    localStorage.removeItem('groceriaWishlist');
    // Redirect to login only if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
};

API.interceptors.response.use((response) => response, handle401);
GAPI.interceptors.response.use((response) => response, handle401);

export default API;

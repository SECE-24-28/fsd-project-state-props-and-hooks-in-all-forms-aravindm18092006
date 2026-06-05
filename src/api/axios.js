import axios from 'axios';

const BASE_URL = 'https://groceria-backend.onrender.com/api';

const axiosConfig = {
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
};

const API  = axios.create({ baseURL: `${BASE_URL}/user`, ...axiosConfig });
export const GAPI = axios.create({ baseURL: BASE_URL,          ...axiosConfig });

const attachToken = (config) => {
  const token = localStorage.getItem('groceriaToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

API.interceptors.request.use(attachToken);
GAPI.interceptors.request.use(attachToken);

const handle401 = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('groceriaToken');
    localStorage.removeItem('groceriaUser');
    localStorage.removeItem('groceriaCart');
    localStorage.removeItem('groceriaWishlist');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
};

// Retry once on network error (handles Render cold start)
const retryOnNetworkError = async (error) => {
  const isNetworkError = !error.response;
  const alreadyRetried = error.config?._retry;
  if (isNetworkError && !alreadyRetried) {
    error.config._retry = true;
    await new Promise((resolve) => setTimeout(resolve, 8000));
    return axios(error.config);
  }
  return Promise.reject(error);
};

API.interceptors.response.use((r) => r, async (error) => {
  try { return await retryOnNetworkError(error); } catch (e) { return handle401(e); }
});
GAPI.interceptors.response.use((r) => r, async (error) => {
  try { return await retryOnNetworkError(error); } catch (e) { return handle401(e); }
});

export default API;

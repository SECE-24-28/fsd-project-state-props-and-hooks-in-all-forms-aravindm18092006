import { GAPI } from './axios';

// Get all products (optionally filtered)
export const fetchProducts = async (category = 'all', sort = '') => {
  const params = {};
  if (category && category !== 'all') params.category = category;
  if (sort) params.sort = sort;
  const { data } = await GAPI.get('/products', { params });
  return data;
};

// Get single product by MongoDB _id
export const fetchProductById = async (id) => {
  const { data } = await GAPI.get(`/products/${id}`);
  return data;
};

// Admin: create product
export const createProduct = async (productData) => {
  const { data } = await GAPI.post('/products', productData);
  return data;
};

// Admin: update product
export const updateProduct = async (id, productData) => {
  const { data } = await GAPI.put(`/products/${id}`, productData);
  return data;
};

// Admin: delete product
export const deleteProduct = async (id) => {
  const { data } = await GAPI.delete(`/products/${id}`);
  return data;
};

// Admin: seed products from default list
export const seedProducts = async (products) => {
  const { data } = await GAPI.post('/products/seed', { products });
  return data;
};

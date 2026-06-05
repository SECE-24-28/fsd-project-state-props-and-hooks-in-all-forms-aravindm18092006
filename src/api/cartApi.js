import { GAPI } from './axios';

export const fetchCart = async () => {
  const { data } = await GAPI.get('/cart');
  return data;
};

export const addItemToCart = async (item) => {
  const { data } = await GAPI.post('/cart/add', item);
  return data;
};

export const updateCartItemQty = async (productId, quantity) => {
  const { data } = await GAPI.put('/cart/update', { productId, quantity });
  return data;
};

export const removeCartItem = async (productId) => {
  const { data } = await GAPI.delete(`/cart/remove/${productId}`);
  return data;
};

export const clearCartApi = async () => {
  const { data } = await GAPI.delete('/cart/clear');
  return data;
};

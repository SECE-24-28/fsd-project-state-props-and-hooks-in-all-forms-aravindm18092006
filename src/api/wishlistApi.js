import { GAPI } from './axios';

export const fetchWishlist = async () => {
  const { data } = await GAPI.get('/wishlist');
  return data;
};

export const addToWishlistApi = async (item) => {
  const { data } = await GAPI.post('/wishlist/add', item);
  return data;
};

export const removeFromWishlistApi = async (productId) => {
  const { data } = await GAPI.delete(`/wishlist/remove/${productId}`);
  return data;
};

export const clearWishlistApi = async () => {
  const { data } = await GAPI.delete('/wishlist/clear');
  return data;
};

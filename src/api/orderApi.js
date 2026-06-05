import { GAPI } from './axios';

export const placeOrderApi = async (orderData) => {
  const { data } = await GAPI.post('/orders', orderData);
  return data;
};

export const fetchMyOrders = async () => {
  const { data } = await GAPI.get('/orders/my');
  return data;
};

export const fetchOrderById = async (id) => {
  const { data } = await GAPI.get(`/orders/${id}`);
  return data;
};

export const cancelOrderApi = async (id) => {
  const { data } = await GAPI.put(`/orders/${id}/cancel`);
  return data;
};

// Admin
export const fetchAllOrders = async () => {
  const { data } = await GAPI.get('/orders/admin/all');
  return data;
};

export const updateOrderStatusApi = async (id, status) => {
  const { data } = await GAPI.put(`/orders/admin/${id}/status`, { status });
  return data;
};

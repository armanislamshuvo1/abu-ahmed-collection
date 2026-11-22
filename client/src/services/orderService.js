import { request } from './api';

export const createOrder = async (orderData) => {
  return request('/orders', {
    method: 'POST',
    body: orderData
  });
};

export const trackOrder = async (orderId) => {
  return request(`/orders/track/${encodeURIComponent(orderId)}`);
};

export const submitOrderTransactionId = async (orderId, transactionId) => {
  return request(`/orders/track/${encodeURIComponent(orderId)}/transaction-id`, {
    method: 'PATCH',
    body: { transactionId }
  });
};

export const getOrdersAdmin = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request(`/orders${query ? `?${query}` : ''}`, {
    isAdmin: true
  });
};

export const getOrderByIdAdmin = async (id) => {
  return request(`/orders/${id}`, {
    isAdmin: true
  });
};

export const updateOrderStatusAdmin = async (id, status, note = '') => {
  return request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: { status, note },
    isAdmin: true
  });
};

export const getAdminStats = async () => {
  return request('/orders/stats/overview', {
    isAdmin: true
  });
};

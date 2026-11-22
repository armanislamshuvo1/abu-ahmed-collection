import { request } from './api';

export const getPublicSettings = async () => {
  return request('/settings/public');
};

export const getAdminSettings = async () => {
  return request('/settings', { isAdmin: true });
};

export const updateDeliverySettings = async (data) => {
  return request('/settings/delivery', {
    method: 'PUT',
    body: data,
    isAdmin: true
  });
};

export const updateGeneralSettings = async (data) => {
  return request('/settings/general', {
    method: 'PUT',
    body: data,
    isAdmin: true
  });
};

export const getPaymentMethodsAdmin = async () => {
  return request('/settings/payment-methods', { isAdmin: true });
};

export const createPaymentMethod = async (data) => {
  return request('/settings/payment-methods', {
    method: 'POST',
    body: data,
    isAdmin: true
  });
};

export const updatePaymentMethod = async (id, data) => {
  return request(`/settings/payment-methods/${id}`, {
    method: 'PUT',
    body: data,
    isAdmin: true
  });
};

export const deletePaymentMethod = async (id) => {
  return request(`/settings/payment-methods/${id}`, {
    method: 'DELETE',
    isAdmin: true
  });
};

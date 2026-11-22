import { request } from './api';

// Customer
export const registerCustomer = async (data) => {
  return request('/users/register', {
    method: 'POST',
    body: data
  });
};

export const loginCustomer = async (data) => {
  return request('/users/login', {
    method: 'POST',
    body: data
  });
};

export const getCustomerProfile = async () => {
  return request('/users/profile');
};

export const updateCustomerProfile = async (data) => {
  return request('/users/profile', {
    method: 'PUT',
    body: data
  });
};

export const getCustomerOrders = async () => {
  return request('/users/my-orders');
};

// Admin
export const loginAdmin = async (data) => {
  return request('/auth/admin/login', {
    method: 'POST',
    body: data
  });
};

export const getAdminMe = async () => {
  return request('/auth/admin/me', {
    isAdmin: true
  });
};

import { request } from './api';

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/products${qs}`);
};

export const getProductBySlug = async (slugOrId) => {
  return request(`/products/${slugOrId}`);
};

export const createProduct = async (formData) => {
  return request('/products', {
    method: 'POST',
    body: formData,
    isAdmin: true,
    isFormData: true
  });
};

export const updateProduct = async (id, formData) => {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: formData,
    isAdmin: true,
    isFormData: true
  });
};

export const deleteProduct = async (id) => {
  return request(`/products/${id}`, {
    method: 'DELETE',
    isAdmin: true
  });
};

export const toggleStock = async (id) => {
  return request(`/products/${id}/toggle-stock`, {
    method: 'PATCH',
    isAdmin: true
  });
};

export const getCategories = async () => {
  return request('/categories');
};

export const getAllCategoriesAdmin = async () => {
  return request('/categories/admin/all', { isAdmin: true });
};

export const createCategory = async (data) => {
  return request('/categories', {
    method: 'POST',
    body: data,
    isAdmin: true
  });
};

export const deleteCategory = async (id) => {
  return request(`/categories/${id}`, {
    method: 'DELETE',
    isAdmin: true
  });
};

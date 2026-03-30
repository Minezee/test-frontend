import api from "."

export const productService = {
  getAll: (limit = 10, skip = 0) =>
    api.get(`/products?limit=${limit}&skip=${skip}`),

  search: (query, limit = 10, skip = 0) =>
    api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}`),

  getById: (id) =>
    api.get(`/products/${id}`),

  create: (data) =>
    api.post('/products/add', data),

  update: (id, data) =>
    api.put(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`),
}

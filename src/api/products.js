import API from "./api";

export const getProducts = () => API.get("api/products");
export const getProduct = (id) => API.get(`api/products/${id}`);
export const createProduct = (data) => API.post("api/products", data);
export const updateProduct = (id, data) =>
  API.put(`api/products/${id}`, data);
export const deleteProduct = (id) =>
  API.delete(`api/products/${id}`);
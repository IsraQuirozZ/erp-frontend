import api from "../api/axios";

export const getProducts = async ({
  page = 1,
  limit = 5,
  status = "active",
  sort = "name",
  order = "asc",
} = {}) => {
  const response = await api.get("/products", {
    params: { page, limit, status, sort, order },
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const activateProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

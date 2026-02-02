import api from "../api/axios";

export const getSuppliers = async ({
  page = 1,
  limit = 5,
  status = "active",
  sort = "name",
  order = "asc",
} = {}) => {
  const response = await api.get("/suppliers", {
    params: { page, limit, status, sort, order },
  });
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

export const activateSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};

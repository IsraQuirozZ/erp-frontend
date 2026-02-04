import api from "../api/axios";

export const getComponentsBySupplierId = async (
  id,
  { page = 1, limit = 5, status = "active", sort = "name", order = "asc" } = {},
) => {
  const response = await api.get(`/components/supplier/${id}`, {
    params: { page, limit, status, sort, order },
  });
  return response.data;
};

export const getComponentById = async (id) => {
  const response = await api.get(`/components/${id}`);
  return response.data;
};

export const activateComponent = async (id) => {
  const response = await api.delete(`/components/${id}`);
  return response.data;
};

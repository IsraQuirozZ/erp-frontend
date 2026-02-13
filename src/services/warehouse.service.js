import api from "../api/axios";

export const getWarehouses = async ({
  page = 1,
  limit = 5,
  status = "active",
  sort = "name",
  order = "asc",
} = {}) => {
  const response = await api.get("/warehouses", {
    params: { page, limit, status, sort, order },
  });
  return response.data;
};

export const getWarehouseById = async (id) => {
  const response = await api.get(`/warehouses/${id}`);
  return response.data;
};

export const activateWarehouse = async (id) => {
  const response = await api.delete(`/warehouses/${id}`);
  return response.data;
};

export const getInventoryByWarehouseId = async (
  id,
  { page = 1, limit = 5, sort = "component.name", order = "asc" } = {},
) => {
  const response = await api.get(`/warehouses/${id}/inventory`, {
    params: { page, limit, sort, order },
  });
  return response.data;
};

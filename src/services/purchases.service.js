import api from "../api/axios";

export const getSupplierOrders = async ({
  page = 1,
  limit = 5,
  status = "all",
  sort = "name",
  order = "asc",
} = {}) => {
  const response = await api.get("/supplier-orders", {
    params: { page, limit, status, sort, order },
  });

  return response.data;
};

export const updateSupplierOrderStatus = async (id, status) => {
  const response = await api.put(`/supplier-orders/${id}`, { status });
  return response.data;
};

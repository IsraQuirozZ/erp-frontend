import api from "../api/axios";

export const getSupplierOrderById = async (id) => {
  const response = await api.get(`/supplier-orders/${id}`);
  return response.data;
};

export const createSupplierOrder = async (data) => {
  const response = await api.post("/supplier-orders", data);
  return response.data;
};

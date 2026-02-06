import api from "../api/axios";

export const createSupplierOrder = async (data) => {
  const response = await api.post("/supplier-orders", data);
  return response.data;
};

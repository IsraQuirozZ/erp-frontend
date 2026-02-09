import api from "../api/axios";

export const getOrderItems = async (
  id,
  { page = 1, limit = 5, sort = "component.name", order = "asc" } = {},
) => {
  const response = await api.get(`/supplier-order-items/${id}/supplier-order`, {
    params: { page, limit, sort, order },
  });
  return response.data;
};

export const createOrderItem = async (data) => {
  const res = await api.post(`/supplier-order-items`, data);
  return res.data;
};

export const updateOrderItem = async (
  id_supplier_order,
  id_component,
  data,
) => {
  const res = await api.put(
    `/supplier-order-items/${id_supplier_order}/${id_component}`,
    data,
  );
  return res.data;
};

export const deleteOrderItem = async ({ id_supplier_order, id_component }) => {
  const res = await api.delete(
    `/supplier-order-items/${id_supplier_order}/${id_component}`,
  );
  return res.data;
};

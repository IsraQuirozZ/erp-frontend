import api from "../api/axios";

export const getOrderItems = async (orderId) => {
  const res = await api.get(`/supplier-orders/${orderId}/items`);
  return res.data;
};

export const createOrderItem = async (data) => {
  const res = await api.post(`/supplier-order-items`, data);
  return res.data;
};

export const updateOrderItem = async (id, data) => {
  const res = await api.put(`/supplier-order-items/${id}`, data);
  return res.data;
};

export const deleteOrderItem = async (id) => {
  const res = await api.delete(`/supplier-order-items/${id}`);
  return res.data;
};

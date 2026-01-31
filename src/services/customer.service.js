import api from "../api/axios"; // tu axios configurado

export const getCustomers = async ({
  page = 1,
  limit = 5,
  status = "active",
} = {}) => {
  const response = await api.get("/clients", {
    params: { page, limit, status },
  });
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const activateCustomer = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

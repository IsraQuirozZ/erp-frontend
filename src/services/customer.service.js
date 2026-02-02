import api from "../api/axios";

export const getCustomers = async ({
  page = 1,
  limit = 5,
  status = "active",
  sort = "name",
  order = "asc",
} = {}) => {
  const response = await api.get("/clients", {
    params: { page, limit, status, sort, order },
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

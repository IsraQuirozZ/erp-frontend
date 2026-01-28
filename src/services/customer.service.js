import api from "../api/axios"; // tu axios configurado

export const getCustomers = async () => {
  const response = await api.get("/clients");
  return response.data;
};

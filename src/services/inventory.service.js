import api from "../api/axios";

export const getInventoryById = async (id_component, id_warehouse) => {
  const response = await api.get(
    `/component-inventories/${id_component}/${id_warehouse}`,
  );
  return response.data;
};

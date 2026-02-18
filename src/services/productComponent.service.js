import api from "../api/axios";

export const getProductComponentsByProductId = async (productId) => {
  const response = await api.get(`/products/${productId}/components`);
  return response.data;
};

export const getProductComponentById = async (productId, componentId) => {
  const response = await api.get(
    `/product-components/${productId}/${componentId}`,
  );
  return response.data;
};

export const createProductComponent = async (data) => {
  const response = await api.post("/product-components", data);
  return response.data;
};

export const updateProductComponent = async (
  productId,
  componentId,
  quantity,
) => {
  const response = await api.put(
    `/product-components/${productId}/${componentId}`,
    {
      quantity,
    },
  );
  return response.data;
};

export const deleteProductComponent = async (productId, componentId) => {
  const response = await api.delete(
    `/product-components/${productId}/${componentId}`,
  );
  return response.data;
};

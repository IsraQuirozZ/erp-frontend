import api from "../api/axios";

export const getInvoiceByOrderId = async (id_supplier_order) => {
  const response = await api.get(
    `/supplier-invoices/${id_supplier_order}/order`,
  );
  return response.data;
};

export const createSupplierInvoice = async (id_supplier_order) => {
  const response = await api.post("/supplier-invoices", { id_supplier_order });
  return response.data;
};

export const updateInvoiceStatus = async (id_supplier_invoice, status) => {
  const response = await api.put(`/supplier-invoices/${id_supplier_invoice}`, {
    status,
  });
  return response.data;
};

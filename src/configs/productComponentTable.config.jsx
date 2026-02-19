// TODO: Add inventory stock, % or pill (Critical, Low, Ok)
export const productComponentColumns = [
  {
    key: "name",
    label: "Component",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "supplier", label: "Supplier" },
  { key: "quantity", label: "Quantity" },
];

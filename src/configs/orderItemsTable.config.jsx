export const orderItemsColumns = [
  {
    key: "product",
    label: "Product",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Price" },
  { key: "taxes", label: "Taxes" },
  { key: "discount", label: "Discount" },
  { key: "total", label: "Total" },
];

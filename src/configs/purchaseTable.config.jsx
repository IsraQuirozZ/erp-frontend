import StatusBadge from "../components/StatusBadge";

export const purchaseColumns = [
  {
    key: "order",
    label: "Order",
    render: (row) => <strong>{row.order}</strong>,
  },
  { key: "supplier", label: "Supplier" },
  { key: "products", label: "Products" },
  { key: "total", label: "Total" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

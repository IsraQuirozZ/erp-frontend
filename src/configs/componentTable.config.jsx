import StatusBadge from "../components/StatusBadge";

export const componentColumns = [
  {
    key: "name",
    label: "Name",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "price", label: "Unit Price" },
  { key: "supplier", label: "Supplier" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

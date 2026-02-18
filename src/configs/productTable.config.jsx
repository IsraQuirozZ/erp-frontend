import StatusBadge from "../components/StatusBadge";

export const productColumns = [
  {
    key: "name",
    label: "Name",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "components", label: "Components" },
  { key: "price", label: "Price" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

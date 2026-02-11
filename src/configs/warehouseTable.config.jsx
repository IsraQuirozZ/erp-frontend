import StatusBadge from "../components/StatusBadge";

export const warehouseColumns = [
  {
    key: "name",
    label: "Name",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "type", label: "Type" },
  { key: "capacity", label: "Capacity" },
  { key: "province", label: "Province" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

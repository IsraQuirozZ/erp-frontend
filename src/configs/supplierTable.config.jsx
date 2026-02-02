import StatusBadge from "../components/StatusBadge";

export const supplierColumns = [
  {
    key: "name",
    label: "Name",
    render: (row) => <strong>{row.name}</strong>,
  },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

import StatusBadge from "../components/StatusBadge";

export const customerColumns = [
  {
    key: "name",
    label: "Name",
    render: (row) => (
      <div>
        <strong>{row.name}</strong>
        <small style={{ opacity: 0.6 }}>Created recently</small>
      </div>
    ),
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

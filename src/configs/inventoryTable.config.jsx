export const inventoryColumns = [
  {
    key: "component",
    label: "Component",
    render: (row) => <strong>{row.component}</strong>,
  },
  {
    key: "indicator",
    label: "Status",
    render: (row) => {
      let color = "#28a745";
      let text = "OK";

      if (row.current_stock <= 10) {
        color = "#dc3545";
        text = "Critical";
      } else if (row.current_stock <= row.max_stock * 0.2) {
        color = "#ffc107";
        text = "Low";
      }

      return (
        <span
          style={{
            backgroundColor: color,
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          {text}
        </span>
      );
    },
  },
  {
    key: "current_stock",
    label: "Stock",
  },
  { key: "min_stock", label: "Min" },
  { key: "max_stock", label: "Max" },
  {
    key: "last_updated",
    label: "Last Updated",
    render: (row) =>
      row.last_updated ? new Date(row.last_updated).toLocaleDateString() : "—",
  },
];

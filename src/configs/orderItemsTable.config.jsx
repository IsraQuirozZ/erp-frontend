export const orderItemsColumns = ({ editingItems, onChange, isEditable }) => [
  {
    key: "name",
    label: "Product",
    render: (row) => <strong>{row.name}</strong>,
  },
  {
    key: "quantity",
    label: "Qty",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      const value = editingItems[rowKey]?.quantity ?? row.quantity;

      return (
        <div className="qty-edit">
          {isEditable && (
            <button
              type="button"
              onClick={() =>
                onChange(row, {
                  quantity: Math.max(1, value - 1),
                })
              }
            >
              −
            </button>
          )}

          <input
            type="number"
            min={1}
            value={value}
            disabled={!isEditable}
            onChange={(e) =>
              onChange(row, {
                quantity: Number(e.target.value),
              })
            }
          />

          {isEditable && (
            <button
              type="button"
              onClick={() =>
                onChange(row, {
                  quantity: value + 1,
                })
              }
            >
              +
            </button>
          )}
        </div>
      );
    },
  },
  {
    key: "unit_price",
    label: "U. Price",
    render: (row) => <span>{Number(row.unit_price).toFixed(2)} €</span>,
  },
  {
    key: "tax",
    label: "Tax %",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      const value = editingItems[rowKey]?.tax ?? row.tax;

      return (
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          disabled={!isEditable}
          onChange={(e) => onChange(row, { tax: Number(e.target.value) })}
        />
      );
    },
  },
  {
    key: "discount",
    label: "Disc %",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      const value = editingItems[rowKey]?.discount ?? row.discount;

      return (
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          disabled={!isEditable}
          onChange={(e) =>
            onChange(row, {
              discount: Number(e.target.value),
            })
          }
        />
      );
    },
  },
  {
    key: "subtotal",
    label: "Subtotal",
    render: (row) => <span>{Number(row.subtotal).toFixed(2)} €</span>,
  },
];

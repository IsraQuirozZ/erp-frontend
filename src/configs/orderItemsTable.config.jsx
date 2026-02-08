// export const orderItemsColumns = [
//   {
//     key: "product",
//     label: "Product",
//     render: (row) => <strong>{row.name}</strong>,
//   },
//   { key: "quantity", label: "Quantity" },
//   { key: "price", label: "Price" },
//   { key: "taxes", label: "Taxes" },
//   { key: "discount", label: "Discount" },
//   { key: "total", label: "Total" },
// ];

export const orderItemsColumns = ({ editingItems, onChange }) => [
  {
    key: "name",
    label: "Component",
  },
  {
    key: "quantity",
    label: "Qty",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      const edit = editingItems[rowKey];

      return (
        <div className="qty-edit">
          <button
            onClick={() =>
              onChange(row, {
                quantity: (edit?.quantity ?? row.quantity) - 1,
              })
            }
          >
            −
          </button>

          <input
            type="number"
            min={1}
            value={edit?.quantity ?? row.quantity}
            onChange={(e) =>
              onChange(row, { quantity: Number(e.target.value) })
            }
          />

          <button
            onClick={() =>
              onChange(row, {
                quantity: (edit?.quantity ?? row.quantity) + 1,
              })
            }
          >
            +
          </button>
        </div>
      );
    },
  },
  {
    key: "unit_price",
    label: "U.Price",
    render: (row) => <span>{Number(row.unit_price).toFixed(2)} €</span>,
  },
  {
    key: "taxes",
    label: "Tax %",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      return (
        <input
          type="number"
          value={editingItems[rowKey]?.taxes ?? row.taxes ?? ""}
          onChange={(e) => onChange(row, { taxes: Number(e.target.value) })}
        />
      );
    },
  },
  {
    key: "discount",
    label: "Disc %",
    render: (row) => {
      const rowKey = `${row.id_supplier_order}-${row.id_component}`;
      return (
        <input
          type="number"
          value={editingItems[rowKey]?.discount ?? row.discount ?? ""}
          onChange={(e) => onChange(row, { discount: Number(e.target.value) })}
        />
      );
    },
  },
  {
    key: "subtotal",
    label: "Subtotal",
    render: (row) => {
      const qty =
        editingItems[`${row.id_supplier_order}-${row.id_component}`]
          ?.quantity ?? row.quantity;

      return (qty * row.unit_price).toFixed(2);
    },
  },
];

import "./dataTable.css";

function DataTable({ columns, data, onRowClick, actions }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick && onRowClick(row)}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}

            {actions && (
              <td onClick={(e) => e.stopPropagation()}>{actions(row)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;

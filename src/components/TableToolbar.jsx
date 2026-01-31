import { FaSearch, FaSort, FaThList } from "react-icons/fa";
import "./tableToolbar.css";

function TableToolbar({ placeholder, filters = [] }) {
  return (
    <div className="table-toolbar">
      {/* SEARCH */}
      {placeholder && (
        <div className="table-toolbar__search">
          <FaSearch className="tabel-toolbar__search-icon" />
          <input placeholder={placeholder} />
        </div>
      )}

      {/* ACTIONS */}
      <div className="table-toolbar__actions">
        {/* FILTERS */}
        {filters.length > 0 && (
          <div className="table-toolbar__filters">
            {filters.map((filter) => {
              if (filter.type === "select") {
                return (
                  <select
                    key={filter.key}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                );
              }

              return null;
            })}
          </div>
        )}
        <button>
          <FaSort className="table-toolbar__actions-icon" /> Sort
        </button>
        {/* 
        <button>
          <FaThList className="table-toolbar__actions-icon" />
        </button> */}
      </div>
    </div>
  );
}

export default TableToolbar;

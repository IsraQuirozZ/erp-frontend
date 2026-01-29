import { FaSearch, FaSort, FaThList } from "react-icons/fa";
import "./tableToolbar.css";

function TableToolbar({ placeholder }) {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__search">
        <FaSearch className="tabel-toolbar__search-icon" />
        <input placeholder={placeholder} />
      </div>

      <div className="table-toolbar__actions">
        <button>
          <FaSort className="table-toolbar__actions-icon" /> Sort
        </button>
        <button>
          <FaThList className="table-toolbar__actions-icon" />
        </button>
      </div>
    </div>
  );
}

export default TableToolbar;

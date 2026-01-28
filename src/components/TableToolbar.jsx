import { FaSearch, FaSort, FaThList } from "react-icons/fa";
import "./tableToolbar.css";

function TableToolbar({ placeholder }) {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__search">
        <FaSearch />
        <input placeholder={placeholder} />
      </div>

      <div className="table-toolbar__actions">
        <button>
          <FaSort /> Sort
        </button>
        <button>
          <FaThList />
        </button>
      </div>
    </div>
  );
}

export default TableToolbar;

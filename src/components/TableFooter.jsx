import "./tableFooter.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function TableFooter({ page, pages, onPageChange, total }) {
  return (
    <div className="table-footer">
      <span>
        Page {page} of {pages} - {total} results
      </span>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <IoIosArrowBack />
        </button>
        <button className="active">{page}</button>
        <button
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}

export default TableFooter;

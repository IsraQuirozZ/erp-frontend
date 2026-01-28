import "./tableFooter.css";

function TableFooter({ total, page, pages }) {
  return (
    <div className="table-footer">
      <span>
        Showing {total > 0 ? 1 : 0} to {total} of {total} results
      </span>

      <div className="pagination">
        <button disabled>{"<"}</button>
        <button className="active">{page}</button>
        <button disabled>{">"}</button>
      </div>
    </div>
  );
}

export default TableFooter;

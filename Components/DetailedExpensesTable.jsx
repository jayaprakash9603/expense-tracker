import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import "../Styles/MonthlyBudget.css"; // Ensure this file contains the provided CSS
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DetailedExpensesTable = ({ data, loading, error }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        sortType: "basic",
      },
      {
        Header: "Expense Name",
        accessor: "expense.expenseName",
        sortType: "basic",
      },
      {
        Header: "Amount",
        accessor: "expense.amount",
        Cell: ({ value }) => value.toFixed(0),
        sortType: "basic",
      },
      {
        Header: "Type",
        accessor: "expense.type",
        sortType: "basic",
      },
      {
        Header: "Payment Method",
        accessor: "expense.paymentMethod",
        sortType: "basic",
      },
      {
        Header: "Comments",
        accessor: "expense.comments",
        Cell: ({ value }) => value || "No Comments",
        sortType: "basic",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 7 },
    },
    useSortBy,
    usePagination
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="table-container">
      <table {...getTableProps()} className="budget-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="custom-tr">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="custom-th"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      <FontAwesomeIcon
                        icon={faSort}
                        className={
                          column.isSortedDesc ? "sorted-desc" : "sorted-asc"
                        }
                      />
                    ) : (
                      <FontAwesomeIcon icon={faSort} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <span className="page-of">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DetailedExpensesTable;

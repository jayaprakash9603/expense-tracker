import React, { useState } from "react";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";
import "../Styles/DailySummary.css";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DefaultColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search`}
      className="filter-input"
    />
  );
};

const DailySummary = ({ data, loading, error }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Amount",
        accessor: "totalAmount",
        Cell: ({ value }) => value.toFixed(2),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Loss",
        accessor: "categoryBreakdown.loss",
        Cell: ({ value }) => (value ? value.toFixed(2) : "0.00"),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Gain",
        accessor: "categoryBreakdown.gain",
        Cell: ({ value }) => (value ? value.toFixed(2) : "0.00"),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Remaining",
        accessor: "balanceRemaining",
        Cell: ({ value }) => value.toFixed(2),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Due",
        accessor: "currentMonthCreditDue",
        Cell: ({ value }) => value.toFixed(2),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      {
        Header: "Credit Paid",
        accessor: "creditPaid",
        Cell: ({ value }) => value.toFixed(2),
        Filter: DefaultColumnFilter,
        sortType: "basic",
      },
      //   {
      //     Header: "Due",
      //     accessor: "creditDue",
      //     Cell: ({ value }) => value.toFixed(2),
      //     Filter: DefaultColumnFilter,
      //     sortType: "basic",
      //   },
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
    setAllFilters,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      defaultColumn: { Filter: DefaultColumnFilter },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const clearAllFilters = () => {
    setAllFilters([]); // Clears all the filters
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <div className="table-container">
      <div className="top-buttons">
        <h1 className="summary-header-text">Summaries Of Expenses</h1>
        <span className="clear-all-btn" onClick={clearAllFilters}>
          Clear All Filters
        </span>
      </div>
      <div>
        <table {...getTableProps()} className="budget-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <>
                {/* Render Header Row */}
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="custom-tr"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      <div>
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FontAwesomeIcon icon={faSortDown} />
                            ) : (
                              <FontAwesomeIcon icon={faSortUp} />
                            )
                          ) : (
                            <FontAwesomeIcon icon={faSort} />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>

                {/* Render Filter Row (Always Visible) */}
                <tr className="filter-row">
                  {headerGroup.headers.map((column) => (
                    <td className="showfilters-td">
                      {column.canFilter ? column.render("Filter") : null}
                    </td>
                  ))}
                </tr>
              </>
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
      </div>
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
          {[7, 10, 20, 30, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DailySummary;

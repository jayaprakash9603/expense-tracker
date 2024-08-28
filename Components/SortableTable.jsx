// SortableTable.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

const SortableTable = ({ data, date }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const { key, direction } = sortConfig;
    if (!key) return data;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="mb-4">
      <h2 className="text-center mb-3">{date}</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-light">
            <tr>
              {[
                "id",
                "expenseName",
                "amount",
                "type",
                "paymentMethod",
                "netAmount",
              ].map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  style={{ cursor: "pointer" }}
                  className="text-center"
                >
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                  {sortConfig.key === header ? (
                    sortConfig.direction === "ascending" ? (
                      <i className="bi bi-arrow-up ms-2"></i>
                    ) : (
                      <i className="bi bi-arrow-down ms-2"></i>
                    )
                  ) : (
                    <i className="bi bi-arrow-down-up ms-2"></i>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData().map((expense) => (
              <tr key={expense.id}>
                <td>{expense.index}</td>
                <td>{expense.expenseName}</td>
                <td>{expense.amount}</td>
                <td>{expense.type}</td>
                <td>{expense.paymentMethod}</td>
                <td>{expense.netAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SortableTable;

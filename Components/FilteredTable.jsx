import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const FilteredTable = ({ filteredData }) => {
  const [sortConfig, setSortConfig] = useState({});
  const [data, setData] = useState(filteredData);

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const handleSort = (date, key) => {
    setSortConfig((prevConfig) => {
      let direction = "ascending";
      if (
        prevConfig[date] &&
        prevConfig[date].key === key &&
        prevConfig[date].direction === "ascending"
      ) {
        direction = "descending";
      }
      return {
        ...prevConfig,
        [date]: { key, direction },
      };
    });
  };

  const sortedData = (date) => {
    const { key, direction } = sortConfig[date] || {};
    const data = filteredData[date] || [];
    if (!key) return data;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  // Calculate the total amount of expenses for a specific date
  const totalAmount = (date) => {
    const data = sortedData(date);
    if (!Array.isArray(data)) return 0;
    return data.reduce((total, expense) => total + (expense.netAmount || 0), 0);
  };

  // Calculate the total salary amount across all dates
  const totalSalaryAmount = () => {
    return Object.keys(filteredData).reduce((total, date) => {
      const data = filteredData[date] || [];
      return (
        total + data.reduce((sum, expense) => sum + (expense.netAmount || 0), 0)
      );
    }, 0);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Would you like to delete?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:3000/name/${id}`);
        // Refresh data after deletion
        const response = await axios.get("http://localhost:3000/name");
        setData(response.data);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  return (
    <div className="table-responsive">
      <div className="mb-4 text-center">
        <h3>
          Total Salary Amount:{" "}
          <span className="fw-bold">{totalSalaryAmount()}</span>
        </h3>
      </div>
      {Object.keys(filteredData).length > 0 ? (
        Object.keys(filteredData).map((date) => (
          <div key={date} className="mb-4">
            <h3 className="text-center">{date}</h3>
            <table className="table table-striped table-bordered">
              <thead className="thead-light">
                <tr>
                  {[
                    { key: "index", label: "ID" },
                    { key: "expenseName", label: "Expense Name" },
                    { key: "amount", label: "Amount" },
                    { key: "type", label: "Type" },
                    { key: "paymentMethod", label: "Payment Method" },
                    { key: "netAmount", label: "Net Amount" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(date, key)}
                      style={{ cursor: "pointer" }}
                      className="text-center"
                    >
                      {label}
                      {sortConfig[date] && sortConfig[date].key === key ? (
                        sortConfig[date].direction === "ascending" ? (
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
                {sortedData(date).map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.index}</td>
                    <td>{expense.expenseName}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.type}</td>
                    <td>{expense.paymentMethod}</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{expense.netAmount}</span>
                        <div className="editDiv">
                          <Link to={`/edit/${expense.id}`} className="editLink">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDelete(expense.id)}
                            style={{
                              marginLeft: "8px",
                              color: "red",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Add total row */}
                <tr className="table-info">
                  <td colSpan="5" className="text-end fw-bold">
                    Total Expense:
                  </td>
                  <td className="fw-bold">{totalAmount(date)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="alert alert-info">No data found.</div>
      )}
    </div>
  );
};

export default FilteredTable;

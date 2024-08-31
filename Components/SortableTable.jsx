import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../Styles/SortableTable.css";
import axios from "axios";
import FilterComponent from "./FilterComponent";

const SortableTable = ({ data, date }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const [filteredData, setFilteredData] = useState(data);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const { key, direction } = sortConfig;
    if (!key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Would you like to delete?");
    if (confirm) {
      axios
        .delete(`http://localhost:3000/name/${id}`)
        .then((res) => {
          console.log(res);
          location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  // Calculate the total amount of expenses
  const totalAmount = () => {
    return sortedData().reduce((total, expense) => total + expense.amount, 0);
  };

  const handleFilter = (field, value) => {
    if (!field) {
      setFilteredData(data);
      return;
    }

    if (field === "date") {
      const filtered = data.filter((item) => item.date === value);
      setFilteredData(filtered);
    } else {
      const filtered = data.filter((item) =>
        item[field].toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-center mb-3">{date}</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-light">
            <tr>
              {[
                { key: "id", width: "10%" },
                { key: "expenseName", width: "25%" },
                { key: "amount", width: "15%" },
                { key: "type", width: "15%" },
                { key: "paymentMethod", width: "20%" },
                { key: "netAmount", width: "15%" },
              ].map(({ key, width }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{ cursor: "pointer", width: width }}
                  className="text-center"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key ? (
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
                <td className="column-id">{expense.index}</td>
                <td className="column-expenseName">{expense.expenseName}</td>
                <td className="column-amount">{expense.amount}</td>
                <td className="column-type">{expense.type}</td>
                <td className="column-paymentMethod">
                  {expense.paymentMethod}
                </td>
                <td className="column-netAmount">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{expense.netAmount}</span>
                    <div className="editDiv">
                      <Link to={`/edit/${expense.id}`} className="editLink">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <Link>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={(e) => handleDelete(expense.id)}
                          style={{ marginLeft: "8px", color: "red" }}
                        />
                      </Link>
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
              <td className="fw-bold">{totalAmount()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SortableTable;

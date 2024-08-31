import React, { useState, useEffect } from "react";

const FilterComponent = ({ inputData, setFilteredData }) => {
  const [filterBy, setFilterBy] = useState(""); // Default to empty for filtering all columns
  const [filterValue, setFilterValue] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    // Initialize filter values when inputData changes
    setFilterValue("");
    setFilterDate("");
    setFilteredData(inputData);
  }, [inputData]);

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    setFilterValue(""); // Clear filter value when filterBy changes
    setFilterDate(""); // Clear date when filterBy changes
    applyFilter("", e.target.value, ""); // Apply filter when filterBy changes
    setFilteredData(inputData);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
    applyFilter(e.target.value, filterBy, filterDate);
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
    applyFilter(filterValue, filterBy, e.target.value);
  };

  const applyFilter = (value, filterBy, date) => {
    if (filterBy === "" && !value && !date) {
      // Show original data if no filter is applied
      setFilteredData(inputData);
    } else if (filterBy === "") {
      // Filter across all columns if filterBy is blank
      const filtered = Object.keys(inputData).reduce((acc, date) => {
        const filteredRows = inputData[date].filter(
          (expense) =>
            expense.expenseName.toLowerCase().includes(value.toLowerCase()) ||
            expense.amount.toString().includes(value) ||
            expense.type.toLowerCase().includes(value.toLowerCase()) ||
            expense.paymentMethod.toLowerCase().includes(value.toLowerCase())
        );
        if (filteredRows.length > 0) {
          acc[date] = filteredRows;
        }
        return acc;
      }, {});
      setFilteredData(filtered);
    } else if (filterBy === "date") {
      // Filter by date
      const filtered = Object.keys(inputData).reduce((acc, currentDate) => {
        if (currentDate === date) {
          acc[currentDate] = inputData[currentDate];
        }
        return acc;
      }, {});
      setFilteredData(filtered);
    } else {
      // Filter by a specific column
      const filtered = Object.keys(inputData).reduce((acc, date) => {
        const filteredRows = inputData[date].filter((expense) =>
          expense[filterBy]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
        if (filteredRows.length > 0) {
          acc[date] = filteredRows;
        }
        return acc;
      }, {});
      setFilteredData(filtered);
    }
  };

  const handleReset = () => {
    setFilteredData(inputData); // Reset filtered data to original data
    setFilterBy("");
    setFilterValue("");
    setFilterDate("");
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <label htmlFor="filterBy" className="me-2">
        Filter By:
      </label>
      <select
        id="filterBy"
        className="form-select me-2"
        value={filterBy}
        onChange={handleFilterChange}
      >
        <option value="">All Columns</option>
        <option value="expenseName">Expense Name</option>
        <option value="amount">Amount</option>
        <option value="type">Type</option>
        <option value="paymentMethod">Payment Method</option>
        <option value="date">Date</option>
      </select>
      <input
        type={filterBy === "date" ? "date" : "text"}
        className="form-control me-2"
        placeholder="Enter filter value"
        value={filterBy === "date" ? filterDate : filterValue}
        onChange={
          filterBy === "date" ? handleFilterDateChange : handleFilterValueChange
        }
      />
      <button className="btn btn-secondary ms-2" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default FilterComponent;

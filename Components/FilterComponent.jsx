import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import "../Styles/FilterComponent.css";
const FilterComponent = ({ inputData, setFilteredData }) => {
  const [filterBy, setFilterBy] = useState(""); // Default to empty for filtering all columns
  const [filterValue, setFilterValue] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Initialize filter values when inputData changes
    setFilterValue("");
    setFilterDate("");
    setFilteredData(inputData);
    setFilterBy("filters");
  }, [inputData]);

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    setFilterValue(""); // Clear filter value when filterBy changes
    setFilterDate(""); // Clear date when filterBy changes
    applyFilter("", e.target.value, ""); // Apply filter when filterBy changes
    setFilteredData(inputData);
    if (inputRef.current) {
      inputRef.current.focus(); // Auto-focus the input field
    }
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
    } else if (filterBy === "allColumns") {
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
    setFilterBy("filters");
    setFilterValue("");
    setFilterDate("");
    location.reload(1);
  };

  return (
    <div
      className="d-flex align-items-center mb-3 p-2"
      style={{
        width: "100%",
        // backgroundColor: "yellow", // Light gray background
        borderRadius: "5px",
      }}
    >
      <select
        id="filterBy"
        className="custom-select"
        value={filterBy}
        onChange={handleFilterChange}
        style={{ maxWidth: "170px" }} // Adjust width as needed
      >
        {" "}
        <option value="filters">Filters </option>
        <option value="allColumns">All expenses</option>
        <option value="expenseName">Expense Name</option>
        <option value="amount">Amount</option>
        <option value="type">Type</option>
        <option value="paymentMethod">Payment Method</option>
        <option value="date">Date</option>
      </select>

      {filterBy !== "filters" && (
        <input
          ref={inputRef}
          type={filterBy === "date" ? "date" : "text"}
          className="custom-select "
          placeholder="Enter value"
          value={filterBy === "date" ? filterDate : filterValue}
          onChange={
            filterBy === "date"
              ? handleFilterDateChange
              : handleFilterValueChange
          }
          style={{ display: filterBy === "filters" ? "none" : "inline-block" }} // Hide input if filterBy is "filters"
        />
      )}

      {filterBy !== "filters" && (
        <button className="btn btn-secondary btn-sm ms-2" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
};

export default FilterComponent;

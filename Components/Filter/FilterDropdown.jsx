// components/FilterDropdown.jsx
import React from "react";

const FilterDropdown = ({ filterBy, setFilterBy }) => {
  const handleFilterChange = (e) => setFilterBy(e.target.value);

  return (
    <select
      id="filterBy"
      className="custom-select"
      value={filterBy}
      onChange={handleFilterChange}
    >
      <option value="filters">Filters</option>
      <option value="allColumns">All expenses</option>
      <option value="expenseName">Expense Name</option>
      <option value="amount">Amount</option>
      <option value="type">Type</option>
      <option value="paymentMethod">Payment Method</option>
      <option value="date">Date</option>
    </select>
  );
};

export default FilterDropdown;

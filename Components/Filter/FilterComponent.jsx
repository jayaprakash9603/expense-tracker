// components/FilterComponent.jsx
import React from "react";
import useFilter from "./useFilter";
import FilterDropdown from "./FilterDropdown";
import FilterInput from "./FilterInput";
import ResetButton from "./ResetButton";
import "../../Styles/FilterComponent.css";

const FilterComponent = ({ inputData, setFilteredData }) => {
  const {
    filteredData,
    filterBy,
    filterValue,
    filterDate,
    setFilterBy,
    setFilterValue,
    setFilterDate,
    applyFilter,
    resetFilters,
  } = useFilter(inputData);

  // Update the parent state whenever filtered data changes
  React.useEffect(() => {
    setFilteredData(filteredData);
  }, [filteredData, setFilteredData]);

  return (
    <div className="filter-container d-flex align-items-center mb-3 p-2">
      <FilterDropdown filterBy={filterBy} setFilterBy={setFilterBy} />
      <FilterInput
        filterBy={filterBy}
        filterValue={filterValue}
        filterDate={filterDate}
        setFilterValue={setFilterValue}
        setFilterDate={setFilterDate}
        applyFilter={applyFilter}
      />
      {filterBy !== "filters" && <ResetButton resetFilters={resetFilters} />}
    </div>
  );
};

export default FilterComponent;

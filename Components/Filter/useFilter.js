// hooks/useFilter.js
import { useState, useEffect } from "react";

const useFilter = (inputData) => {
  const [filteredData, setFilteredData] = useState(inputData);
  const [filterBy, setFilterBy] = useState("filters");
  const [filterValue, setFilterValue] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    setFilteredData(inputData);
  }, [inputData]);

  const applyFilter = (value, filterBy, date) => {
    if (filterBy === "" && !value && !date) {
      setFilteredData(inputData);
    } else if (filterBy === "allColumns") {
      const filtered = Object.keys(inputData).reduce((acc, date) => {
        const filteredRows = inputData[date].filter((expense) =>
          ["expenseName", "amount", "type", "paymentMethod"].some((key) =>
            expense[key]?.toString().toLowerCase().includes(value.toLowerCase())
          )
        );
        if (filteredRows.length) acc[date] = filteredRows;
        return acc;
      }, {});
      setFilteredData(filtered);
    } else if (filterBy === "date") {
      const filtered = Object.keys(inputData).reduce((acc, currentDate) => {
        if (currentDate === date) acc[currentDate] = inputData[currentDate];
        return acc;
      }, {});
      setFilteredData(filtered);
    } else {
      const filtered = Object.keys(inputData).reduce((acc, date) => {
        const filteredRows = inputData[date].filter((expense) =>
          expense[filterBy]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
        if (filteredRows.length) acc[date] = filteredRows;
        return acc;
      }, {});
      setFilteredData(filtered);
    }
  };

  const resetFilters = () => {
    setFilteredData(inputData);
    setFilterBy("filters");
    setFilterValue("");
    setFilterDate("");
  };

  return {
    filteredData,
    filterBy,
    filterValue,
    filterDate,
    setFilterBy,
    setFilterValue,
    setFilterDate,
    applyFilter,
    resetFilters,
  };
};

export default useFilter;

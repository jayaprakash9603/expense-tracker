import { useState } from "react";

export const useSortConfig = () => {
  const [sortConfig, setSortConfig] = useState({});

  const handleSort = (key, date) => {
    setSortConfig((prevConfig) => {
      let direction = "ascending";
      if (
        prevConfig[date]?.key === key &&
        prevConfig[date]?.direction === "ascending"
      ) {
        direction = "descending";
      }
      return { ...prevConfig, [date]: { key, direction } };
    });
  };

  const getSortedData = (data, date) => {
    const { key, direction } = sortConfig[date] || {};
    if (!key) return data;

    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  return { sortConfig, handleSort, getSortedData };
};

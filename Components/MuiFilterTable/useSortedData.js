import { useState } from "react";

export const useSortedData = (data) => {
  const [sortConfig, setSortConfig] = useState({});

  const sortedData = (date) => {
    const { key, direction } = sortConfig[date] || {};
    const dataForDate = data[date] || [];
    if (!key) return dataForDate;

    return [...dataForDate].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (date, key) => {
    let direction = "ascending";
    if (
      sortConfig[date] &&
      sortConfig[date].key === key &&
      sortConfig[date].direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      [date]: { key, direction },
    }));
  };

  return { sortedData, handleSort, sortConfig };
};

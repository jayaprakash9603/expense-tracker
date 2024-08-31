// RenderTable.jsx
import React from "react";
import SortableTable from "./SortableTable";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

const RenderTable = ({ inputData, sortOrder }) => {
  // Sort dates based on sortOrder

  const sortedDates = Object.keys(inputData).sort((a, b) =>
    sortOrder === "asc" ? new Date(a) - new Date(b) : new Date(b) - new Date(a)
  );

  if (sortedDates.length === 0) {
    return <div className="alert alert-info">No expenses to display.</div>;
  }
  {
    console.log("sortedData" + sortedDates);
  }

  return (
    <div className="container mt-4">
      {sortedDates.map((date) => (
        <SortableTable key={date} data={inputData[date]} date={date} />
      ))}
    </div>
  );
};

export default RenderTable;

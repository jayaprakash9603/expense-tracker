// RenderTable.jsx
import React from "react";
import SortableTable from "./SortableTable";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

const RenderTable = ({ inputData }) => {
  // Sort dates in ascending order
  const sortedDates = Object.keys(inputData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="container mt-4">
      {sortedDates.map((date) => (
        <SortableTable key={date} data={inputData[date]} date={date} />
      ))}
    </div>
  );
};

export default RenderTable;

// components/ResetButton.jsx
import React from "react";

const ResetButton = ({ resetFilters }) => (
  <button className="btn btn-secondary btn-sm ms-2" onClick={resetFilters}>
    Reset
  </button>
);

export default ResetButton;

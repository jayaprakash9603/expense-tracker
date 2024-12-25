// components/FiltersHeader.js

import React from "react";

const FiltersHeader = ({ handleClearAllClick }) => {
  return (
    <div className="width main-text">
      <p className="filters-text">Filters</p>
      <p className="clear-all-text" onClick={handleClearAllClick}>
        Clear All
      </p>
    </div>
  );
};

export default FiltersHeader;

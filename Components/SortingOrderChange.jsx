import React, { useState } from "react";

const SortingOrderChange = (e) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };
  return (
    <div>
      <div className="d-flex flex-column align-items-start justify-content-center">
        <select
          id="sortOrder"
          className="form-select w-auto"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="desc">Sort By</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default SortingOrderChange;

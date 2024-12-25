import React from "react";

const Filters = ({
  searchTerm,
  specificYear,
  setSpecificYear,
  specificMonth,
  setSpecificMonth,
  specificDay,
  setSpecificDay,
  startYear,
  setStartYear,
  startMonth,
  setStartMonth,
  endYear,
  setEndYear,
  endMonth,
  setEndMonth,
}) => {
  return (
    <>
      {searchTerm === "Yearly Wise Daily Expense Summary" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            value={specificYear}
            placeholder="Enter Year"
            onChange={(e) => setSpecificYear(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expense Summary for Specific Date" && (
        <div className="form-group mb-3">
          <input
            type="date"
            className="log-period"
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Monthly Wise Daily Expense Summary" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period mb-3"
            value={specificYear}
            placeholder="Enter Year"
            onChange={(e) => setSpecificYear(e.target.value)}
          />
          <input
            type="number"
            className="log-period"
            value={specificMonth}
            placeholder="Enter Month"
            onChange={(e) => setSpecificMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Summary Between Dates" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period mb-3"
            value={startYear}
            placeholder="Enter Start Year"
            onChange={(e) => setStartYear(e.target.value)}
          />

          <input
            type="number"
            className="log-period mb-3"
            value={startMonth}
            placeholder="Enter Start Month"
            onChange={(e) => setStartMonth(e.target.value)}
          />

          <input
            type="number"
            className="log-period mb-3"
            value={endYear}
            placeholder="Enter End Year"
            onChange={(e) => setEndYear(e.target.value)}
          />

          <input
            type="number"
            className="log-period"
            value={endMonth}
            placeholder="Enter End Month"
            onChange={(e) => setEndMonth(e.target.value)}
          />
        </div>
      )}
    </>
  );
};

export default Filters;

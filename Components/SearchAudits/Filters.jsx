import React from "react";

const Filters = ({
  searchTerm,
  specificYear,
  setSpecificYear,
  specificMonth,
  setSpecificMonth,
  specificDay,
  setSpecificDay,
  expenseId,
  setExpenseId,
  actionType,
  setActionType,
  nMinutes,
  setNMinutes,
  nSeconds,
  setNSeconds,
  nHours,
  setNHours,
  nDays,
  setNDays,
}) => {
  return (
    <>
      {searchTerm === "Logs for Specific Year" && (
        <div className="mb-3">
          <input
            type="number"
            className="log-period"
            value={specificYear}
            placeholder="Enter a specific year"
            onChange={(e) => setSpecificYear(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs for Specific Month" && (
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

      {searchTerm === "Logs for Specific Day" && (
        <div className="form-group mb-3">
          <label className="label">Enter Date</label>
          <input
            type="date"
            className="form-control width mb-4"
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs by Action Type" && (
        <div className="form-group mb-3">
          <select
            className="log-period"
            placeholder="Enter Action Type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}

      {searchTerm === "Logs by Expense ID and Action Type" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period mb-3"
            placeholder="Enter Expense ID"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />

          <select
            className="log-period"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}

      {searchTerm === "Logs from Last N Minutes" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Minutes Number"
            value={nMinutes}
            onChange={(e) => setNMinutes(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs from Last N Hours" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Hours Number"
            value={nHours}
            onChange={(e) => setNHours(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs from Last N Days" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter the number of days"
            value={nDays}
            onChange={(e) => setNDays(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs from Last N Seconds" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Seconds..."
            value={nSeconds}
            onChange={(e) => setNSeconds(e.target.value)}
          />
        </div>
      )}

      {searchTerm === "Logs by Expense ID" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Expense ID"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />
        </div>
      )}
    </>
  );
};

export default Filters;

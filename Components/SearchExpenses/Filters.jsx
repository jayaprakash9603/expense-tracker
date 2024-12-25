import React from "react";

const Filters = ({
  searchTerm,
  specificYear,
  setSpecificYear,
  specificMonth,
  setSpecificMonth,
  fromDay,
  setFromDay,
  toDay,
  setToDay,
  expenseName,
  setExpenseName,
  paymentMethod,
  setPaymentMethod,
  category,
  setCategory,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  startYear,
  setStartYear,
  startMonth,
  setStartMonth,
}) => {
  return (
    <>
      {searchTerm === "Particular Date Expenses" && (
        <div className="form-group mb-3 width">
          <input
            type="date"
            className="form-control"
            value={fromDay}
            onChange={(e) => setFromDay(e.target.value)}
            title="Enter Date (yyyy-MM-dd)"
          />
        </div>
      )}
      {searchTerm === "Particular Month Expenses" && (
        <div className="form-group mb-3 width">
          <label>Enter Start Year:</label>
          <input
            type="number"
            className="form-control"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <label>Enter Start Month:</label>
          <input
            type="number"
            className="form-control"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Name" && (
        <div className="form-group mb-3 width">
          <input
            type="text"
            className="form-control"
            value={expenseName}
            placeholder="Enter expense name"
            onChange={(e) => setExpenseName(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Payment Method" && (
        <div className="form-group mb-3 width">
          <select
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Select Payment Method --</option>
            <option value="cash">Cash</option>
            <option value="creditNeedToPaid">Credit Due</option>
            <option value="creditPaid">Credit Paid</option>
          </select>
        </div>
      )}
      {searchTerm === "Within Range Expenses" && (
        <div className="form-group mb-3 width">
          <div className="from-date">
            <label>From</label>
            <input
              type="date"
              className="form-control"
              value={fromDay}
              onChange={(e) => setFromDay(e.target.value)}
            />
          </div>
          <div className="to-date">
            <label>To</label>
            <input
              type="date"
              className="form-control"
              value={toDay}
              onChange={(e) => setToDay(e.target.value)}
            />
          </div>
        </div>
      )}
      {searchTerm === "Expenses By Type and Payment Method" && (
        <div className="form-group mb-3">
          <div className="width">
            <select
              className="form-control mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              <option value="loss">Loss</option>
              <option value="gain">Gain</option>
            </select>
          </div>
          <div className="width">
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">-- Select Payment Method --</option>
              <option value="cash">Cash</option>
              <option value="creditNeedToPaid">Credit Due</option>
              <option value="creditPaid">Credit Paid</option>
            </select>
          </div>
        </div>
      )}
      {searchTerm === "Expenses By Type" && (
        <div className="form-group mb-3">
          <div className="width">
            <select
              className="form-control mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              <option value="loss">Loss</option>
              <option value="gain">Gain</option>
            </select>
          </div>
        </div>
      )}
      {searchTerm === "Expenses Within Amount Range" && (
        <div className="form-group mb-3 ">
          <div className="width">
            <input
              type="number"
              step="0.01"
              className="form-control mb-3"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Enter minimum amount"
            />
          </div>
          <div className="width">
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Enter maximum amount"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;

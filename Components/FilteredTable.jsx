import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FilteredTable = ({ filteredData }) => {
  return (
    <div className="table-responsive">
      {Object.keys(filteredData).length > 0 ? (
        Object.keys(filteredData).map((date) => (
          <div key={date} className="mb-4">
            <h3 className="text-center">{date}</h3>
            <table className="table table-striped table-bordered">
              <thead className="thead-light">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Expense Name</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Type</th>
                  <th className="text-center">Payment Method</th>
                  <th className="text-center">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredData[date].map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.id}</td>
                    <td>{expense.expenseName}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.type}</td>
                    <td>{expense.paymentMethod}</td>
                    <td>{expense.netAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="alert alert-info">No data found.</div>
      )}
    </div>
  );
};

export default FilteredTable;

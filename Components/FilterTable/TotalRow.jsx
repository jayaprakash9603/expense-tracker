import React from "react";

const TotalRow = ({ data }) => {
  const totalAmount = data.reduce(
    (total, expense) => total + expense.netAmount,
    0
  );

  return (
    <tr className="table-info">
      <td colSpan="5" className="text-end fw-bold">
        Total Expense:
      </td>
      <td className="fw-bold">{totalAmount}</td>
    </tr>
  );
};

export default TotalRow;

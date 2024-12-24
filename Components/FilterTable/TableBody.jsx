import React from "react";
import Actions from "./Actions";

const TableBody = ({ data, onDelete }) => {
  return data.map((expense) => (
    <tr key={expense.id}>
      <td>{expense.index}</td>
      <td>{expense.expenseName}</td>
      <td className="text-center">{expense.amount}</td>
      <td className="text-center">{expense.type}</td>
      <td className="text-center">{expense.paymentMethod}</td>
      <td>
        <div className="d-flex justify-content-between align-items-center">
          <span>{expense.netAmount}</span>
          <Actions id={expense.id} onDelete={onDelete} />
        </div>
      </td>
    </tr>
  ));
};

export default TableBody;

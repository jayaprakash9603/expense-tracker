import React from "react";
import { TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import Actions from "./Actions";

const TableBodyComponent = ({ data, methodMapping, handleDelete }) => {
  return (
    <TableBody>
      {data.map((expense) => (
        <TableRow key={expense.id}>
          <TableCell>{expense.index}</TableCell>
          <TableCell>{expense.expenseName}</TableCell>
          <TableCell align="center">{expense.amount}</TableCell>
          <TableCell align="center">{expense.type}</TableCell>
          <TableCell align="center">
            {methodMapping[expense.paymentMethod] || expense.paymentMethod}
          </TableCell>
          <TableCell>
            <div className="d-flex justify-content-between align-items-center">
              <span>{expense.netAmount}</span>
              <Actions id={expense.id} onDelete={handleDelete} />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableBodyComponent;

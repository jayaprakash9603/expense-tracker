import React from "react";
import { TableRow, TableCell } from "@mui/material";

const TotalRow = ({ data }) => {
  const totalAmount = data.reduce(
    (total, expense) => total + (expense.netAmount || 0),
    0
  );

  return (
    <TableRow className="table-info">
      <TableCell colSpan={5} align="right" className="fw-bold">
        Total Expense:
      </TableCell>
      <TableCell className="fw-bold">{totalAmount}</TableCell>
    </TableRow>
  );
};

export default TotalRow;

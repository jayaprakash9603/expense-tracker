import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

const TableHeader = ({ date, handleSort, sortConfig }) => {
  const headers = [
    { key: "index", label: "ID" },
    { key: "expenseName", label: "Expense Name" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Type" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "netAmount", label: "Net Amount" },
  ];

  return (
    <TableHead>
      <TableRow>
        {headers.map(({ key, label }) => (
          <TableCell
            key={key}
            onClick={() => handleSort(date, key)}
            style={{ cursor: "pointer" }}
          >
            {label}
            {sortConfig[date] && sortConfig[date].key === key ? (
              sortConfig[date].direction === "ascending" ? (
                <i className="bi bi-arrow-up ms-2"></i>
              ) : (
                <i className="bi bi-arrow-down ms-2"></i>
              )
            ) : (
              <i className="bi bi-arrow-down-up ms-2"></i>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;

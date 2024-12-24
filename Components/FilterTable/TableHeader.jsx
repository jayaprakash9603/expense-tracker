import React from "react";

const TableHeader = ({ date, onSort }) => {
  const headers = [
    { key: "index", label: "ID" },
    { key: "expenseName", label: "Expense Name" },
    { key: "amount", label: "Amount" },
    { key: "type", label: "Type" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "netAmount", label: "Net Amount" },
  ];

  return (
    <thead className="thead-light">
      <tr>
        {headers.map(({ key, label }) => (
          <th
            key={key}
            onClick={() => onSort(date, key)}
            style={{ cursor: "pointer" }}
            className="text-center"
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;

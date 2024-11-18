import React, { useState } from "react";
import ExpensesEmail from "./ExpensesEmail";
import AuditLogsEmailSender from "./AuditLogsEmailSender";

const ReportsGeneration = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleDropdownChange = (event) => {
    setSelectedReport(event.target.value);
  };

  return (
    <div>
      <select onChange={handleDropdownChange}>
        <option value="select">Select Report</option>
        <option value="auditLogsReport">Audit Logs Report</option>
        <option value="expenseReport">Expense Report</option>
      </select>

      {selectedReport === "select" && <></>}

      {selectedReport === "auditLogsReport" && <AuditLogsEmailSender />}
      {selectedReport === "expenseReport" && <ExpensesEmail />}
    </div>
  );
};

export default ReportsGeneration;

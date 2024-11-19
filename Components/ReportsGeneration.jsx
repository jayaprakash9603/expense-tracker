import React, { useState } from "react";
import ExpensesEmail from "./ExpensesEmail";
import AuditLogsEmailSender from "./AuditLogsEmailSender";
import ExpenseSummaryEmailSender from "./ExpenseSummaryEmailSender";

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
        <option value="expenseSummary">Expense Summary Report</option>
      </select>

      {selectedReport === "select" && <></>}

      {selectedReport === "auditLogsReport" && <AuditLogsEmailSender />}
      {selectedReport === "expenseReport" && <ExpensesEmail />}
      {selectedReport === "expenseSummary" && <ExpenseSummaryEmailSender />}
    </div>
  );
};

export default ReportsGeneration;

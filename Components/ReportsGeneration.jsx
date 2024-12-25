import React, { useState } from "react";
import ExpensesEmail from "./ExpensesEmail";
import AuditLogsEmailSender from "./AuditLogsEmailSender";
import ExpenseSummaryEmailSender from "./ExpenseSummaryEmailSender";
import "../Styles/ReportsGeneration.css";
import ExpenseTableParent from "./ExpenseTableParent";
import SearchExpenses from "./SearchExpenses/SearchExpenses";
import SearchSummary from "./SearchSummary/SearchSummary";
import SearchAudits from "./SearchAudits/SearchAudits";

const ReportsGeneration = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [Url, setUrl] = useState(null);

  const handleDropdownChange = (event) => {
    setSelectedReport(event.target.value);
    setUrl(null);
  };

  return (
    <div className="main-container">
      <div>
        <div className="select-div">
          <select onChange={handleDropdownChange} className="select-dropdown">
            <option value="select">Select Report</option>
            <option value="auditLogsReport">Audit Logs Report</option>
            <option value="expenseReport">Expense Report</option>
            <option value="expenseSummary">Expense Summary Report</option>
            <option value="searchExpenses">Search Expenses</option>
            <option value="searchSummary">Search Summary</option>
            <option value="searchAudits">Search Audits</option>
          </select>
        </div>
        <div className="component-div">
          {selectedReport === "select" && <></>}
          {selectedReport === "auditLogsReport" && <AuditLogsEmailSender />}
          {selectedReport === "expenseReport" && <ExpensesEmail />}
          {selectedReport === "expenseSummary" && <ExpenseSummaryEmailSender />}
          {selectedReport === "searchExpenses" && (
            <SearchExpenses Url={Url} setUrl={setUrl} />
          )}
          {selectedReport === "searchSummary" && (
            <SearchSummary Url={Url} setUrl={setUrl} />
          )}
          {selectedReport === "searchAudits" && (
            <SearchAudits Url={Url} setUrl={setUrl} />
          )}
        </div>
        <div className="display-expenses">
          <ExpenseTableParent
            Url={Url}
            setUrl={setUrl}
            className="w-100"
            selectedReport={selectedReport}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsGeneration;

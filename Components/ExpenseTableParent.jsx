import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailedExpensesTable from "./DetailedExpensesTable";
import DailySummary from "./DailySummary";
import ExpensesAudits from "./ExpensesAudits";

const ExpenseTableParent = ({ Url, setUrl, selectedReport }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [auditsData, setAuditsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedReport) {
      fetchData(selectedReport);
    }
  }, [selectedReport, Url]);

  const fetchData = async (reportType) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (reportType) {
        case "searchExpenses":
          response = await axios.get(
            Url || "http://localhost:3000/fetch-expenses"
          );
          if (response.status === 204 || response.data.length === 0) {
            alert("No expenses found.");
            response = await axios.get("http://localhost:3000/fetch-expenses");
          }
          setExpensesData(response.data);
          break;

        case "searchSummary":
          response = await axios.get(
            Url ||
              "http://localhost:3000/daily-summary/monthly?year=2024&month=11"
          );
          if (response.status === 204 || response.data.length === 0) {
            alert("No summary found.");
            response = await axios.get(
              "http://localhost:3000/daily-summary/monthly?year=2024&month=11"
            );
          }
          setSummaryData(response.data);
          break;

        case "searchAudits":
          response = await axios.get(
            Url || "http://localhost:3000/audit-logs/all"
          );
          if (response.status === 204 || response.data.length === 0) {
            alert("No logs found.");
            response = await axios.get("http://localhost:3000/audit-logs/all");
          }
          setAuditsData(response.data);
          break;

        default:
          setError("Invalid report type selected.");
          return;
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {selectedReport === "searchExpenses" && (
        <DetailedExpensesTable
          data={expensesData}
          loading={loading}
          error={error}
        />
      )}
      {selectedReport === "searchSummary" && (
        <DailySummary data={summaryData} loading={loading} error={error} />
      )}
      {selectedReport === "searchAudits" && (
        <ExpensesAudits data={auditsData} loading={loading} error={error} />
      )}
    </div>
  );
};

export default ExpenseTableParent;

import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailedExpensesTable from "./DetailedExpensesTable";
import DailySummary from "./DailySummary";
import ExpensesAudits from "./ExpensesAudits";

const ExpenseTableParent = ({ Url, setUrl, selectedReport }) => {
  // Separate state variables for each type of data
  const [expensesData, setExpensesData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [auditsData, setAuditsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Determine which API to call based on selectedReport
    if (selectedReport) {
      fetchData(selectedReport);
    }
  }, [selectedReport, Url]); // Trigger when selectedReport or Url changes

  const fetchData = async (reportType) => {
    setLoading(true);
    setError(null); // Clear any existing errors

    try {
      let response;

      switch (reportType) {
        case "searchExpenses":
          response = await axios.get(
            Url || "http://localhost:3000/fetch-expenses"
          );
          setExpensesData(response.data);
          break;

        case "searchSummary":
          response = await axios.get(
            Url ||
              "http://localhost:3000/daily-summary/monthly?year=2024&month=11"
          );
          setSummaryData(response.data);
          break;

        case "searchAudits":
          response = await axios.get(
            Url || "http://localhost:3000/audit-logs/all"
          );
          setAuditsData(response.data);
          break;

        default:
          setError("Invalid report type selected.");
          return;
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false); // Ensure loading state is updated
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

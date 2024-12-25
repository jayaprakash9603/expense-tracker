// utils/handleShowExpenses.js

const handleShowExpenses = (
  searchTerm,
  specificYear,
  specificMonth,
  specificDay,
  expenseId,
  actionType,
  nMinutes,
  nSeconds,
  nHours,
  nDays,
  logTypes,
  setUrl,
  setError
) => {
  setError("");

  let url = "";
  let params = {};

  switch (searchTerm) {
    case "Current Month Logs":
      url = "http://localhost:3000/audit-logs/current-month";
      break;
    case "Last Month Logs":
      url = "http://localhost:3000/audit-logs/last-month";
      break;
    case "Current Year Logs":
      url = "http://localhost:3000/audit-logs/current-year";
      break;
    case "Last Year Logs":
      url = "http://localhost:3000/audit-logs/last-year";
      break;
    case "Current Week Logs":
      url = "http://localhost:3000/audit-logs/current-week";
      break;
    case "Last Week Logs":
      url = "http://localhost:3000/audit-logs/last-week";
      break;
    case "Today Logs":
      url = "http://localhost:3000/audit-logs/today";
      break;
    case "Logs for Specific Year":
      if (!specificYear) {
        setError("Please provide a specific year.");
        return;
      }
      url = `http://localhost:3000/audit-logs/year/${specificYear}`;
      break;
    case "Logs for Specific Month":
      if (!specificYear || !specificMonth) {
        setError("Please provide both year and month.");
        return;
      }
      url = "http://localhost:3000/audit-logs/month";
      params.year = specificYear;
      params.month = specificMonth;
      break;
    case "Logs for Specific Day":
      if (!specificDay) {
        setError("Please provide a specific day.");
        return;
      }
      url = "http://localhost:3000/audit-logs/day";
      params.date = specificDay;
      break;
    case "Logs by Action Type":
      if (!actionType) {
        setError("Please provide an action type.");
        return;
      }
      url = `http://localhost:3000/audit-logs/action/${actionType}`;
      break;
    case "Logs by Expense ID and Action Type":
      const parsedExpenseId = parseInt(expenseId, 10);
      if (isNaN(parsedExpenseId)) {
        setError("Expense ID must be an integer.");
        return;
      }
      if (!actionType) {
        setError("Please provide an action type.");
        return;
      }
      url = `http://localhost:3000/audit-logs/expense/${parsedExpenseId}/action/${actionType}`;
      break;
    case "Logs from Last N Minutes":
      if (!nMinutes) {
        setError("Please provide the number of minutes.");
        return;
      }
      url = "http://localhost:3000/audit-logs/last-n-minutes";
      params.minutes = nMinutes;
      break;
    case "Logs from Last N Hours":
      if (!nHours) {
        setError("Please provide the number of hours.");
        return;
      }
      url = "http://localhost:3000/audit-logs/last-n-hours";
      params.hours = nHours;
      break;
    case "Logs from Last N Days":
      if (!nDays) {
        setError("Please provide the number of days.");
        return;
      }
      url = "http://localhost:3000/audit-logs/last-n-days";
      params.days = nDays;
      break;
    case "Logs from Last N Seconds":
      if (!nSeconds) {
        setError("Please provide the number of seconds.");
        return;
      }
      url = "http://localhost:3000/audit-logs/last-n-seconds";
      params.seconds = nSeconds;
      break;
    case "Logs from Last 5 Minutes":
      url = "http://localhost:3000/audit-logs/last-5-minutes";
      break;
    case "All Audit Logs":
      url = "http://localhost:3000/audit-logs/all";
      break;
    case "Logs by Expense ID":
      const parsedExpenseId1 = parseInt(expenseId, 10);
      if (isNaN(parsedExpenseId1)) {
        setError("Expense ID must be an integer.");
        return;
      }
      url = `http://localhost:3000/audit-logs/expenses/${parsedExpenseId1}`;
      break;
    default:
      setError("Please select a valid option.");
      return;
  }

  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams(params).toString();
    url = `${url}?${queryParams}`;
  }

  console.log("Sending request to:", url, "with params:", params);
  setUrl(url);
};

export default handleShowExpenses;

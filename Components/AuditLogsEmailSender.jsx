import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AuditLogsEmailSender = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState("");
  const [expenseId, setExpenseId] = useState("");
  const [actionType, setActionType] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }

    setError(""); // Clear any previous errors

    let url = "";
    let params = { email };

    switch (selectedOption) {
      case "currentMonth":
        url = "http://localhost:3000/audit-logs/current-month/email";
        break;
      case "lastMonth":
        url = "http://localhost:3000/audit-logs/last-month/email";
        break;
      case "currentYear":
        url = "http://localhost:3000/audit-logs/current-year/email";
        break;
      case "lastYear":
        url = "http://localhost:3000/audit-logs/last-year/email";
        break;
      case "currentWeek":
        url = "http://localhost:3000/audit-logs/current-week/email";
        break;
      case "lastWeek":
        url = "http://localhost:3000/audit-logs/last-week/email";
        break;
      case "today":
        url = "http://localhost:3000/audit-logs/today/email";
        break;
      case "specificYear":
        url = `http://localhost:3000/audit-logs/year/${year}/email`;
        break;
      case "specificMonth":
        url = "http://localhost:3000/audit-logs/month/email";
        params = { ...params, year, month };
        break;
      case "specificDay":
        url = "http://localhost:3000/audit-logs/day/email";
        params = { ...params, date };
        break;
      case "actionType":
        url = `http://localhost:3000/audit-logs/action/${actionType}/email`;
        break;
      case "expenseIdAndActionType":
        url = `http://localhost:3000/audit-logs/expense/${expenseId}/action/${actionType}/email`;
        break;
      case "lastNMinutes":
        url = "http://localhost:3000/audit-logs/last-n-minutes/email";
        params = { ...params, minutes: timeValue };
        break;
      case "lastNHours":
        url = "http://localhost:3000/audit-logs/last-n-hours/email";
        params = { ...params, hours: timeValue };
        break;
      case "lastNDays":
        url = "http://localhost:3000/audit-logs/last-n-days/email";
        params = { ...params, days: timeValue };
        break;
      case "lastNSeconds":
        url = "http://localhost:3000/audit-logs/last-n-seconds/email";
        params = { ...params, seconds: timeValue };
        break;
      case "lastFiveMinutes":
        url = "http://localhost:3000/audit-logs/last-5-minutes/email";
        break;
      case "allAuditLogs":
        url = "http://localhost:3000/audit-logs/all/email";
        break;
      case "expenseId":
        url = `http://localhost:3000/audit-logs/expenses/${expenseId}/email`;
        break;
      default:
        setError("Please select a valid option.");
        return;
    }

    axios
      .get(url, { params })
      .then((response) => {
        if (response.status === 204) {
          alert("No expenses were found.");
        } else {
          alert("Email sent successfully!");
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      });
  };

  return (
    <div className="container mt-5" style={{ height: "600px", width: "600px" }}>
      <h1>Send Audit Logs by Email</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group mb-3">
        <label>Select Log Period:</label>
        <select
          className="form-control"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">Select an option</option>
          <option value="currentMonth">Current Month Logs</option>
          <option value="lastMonth">Last Month Logs</option>
          <option value="currentYear">Current Year Logs</option>
          <option value="lastYear">Last Year Logs</option>
          <option value="currentWeek">Current Week Logs</option>
          <option value="lastWeek">Last Week Logs</option>
          <option value="today">Today Logs</option>
          <option value="specificYear">Logs for Specific Year</option>
          <option value="specificMonth">Logs for Specific Month</option>
          <option value="specificDay">Logs for Specific Day</option>
          <option value="actionType">Logs by Action Type</option>
          <option value="expenseIdAndActionType">
            Logs by Expense ID and Action Type
          </option>
          <option value="lastNMinutes">Logs from Last N Minutes</option>
          <option value="lastNHours">Logs from Last N Hours</option>
          <option value="lastNDays">Logs from Last N Days</option>
          <option value="lastNSeconds">Logs from Last N Seconds</option>
          <option value="lastFiveMinutes">Logs from Last 5 Minutes</option>
          <option value="allAuditLogs">All Audit Logs</option>
          <option value="expenseId">Logs by Expense ID</option>
        </select>
      </div>
      {(selectedOption === "specificYear" ||
        selectedOption === "specificMonth") && (
        <div className="form-group mb-3">
          <label>Enter Year:</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      )}
      {selectedOption === "specificMonth" && (
        <div className="form-group mb-3">
          <label>Enter Month:</label>
          <input
            type="number"
            className="form-control"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      )}
      {selectedOption === "specificDay" && (
        <div className="form-group mb-3">
          <label>Enter Date (yyyy-MM-dd):</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      )}
      {selectedOption === "actionType" && (
        <div className="form-group mb-3">
          <label>Select Action Type:</label>
          <select
            className="form-control"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="">Select an action type</option>
            <option value="create">Create</option>
            <option value="delete">Delete</option>
            <option value="update">Update</option>
          </select>
        </div>
      )}
      {selectedOption === "expenseIdAndActionType" && (
        <>
          <div className="form-group mb-3">
            <label>Enter Expense ID:</label>
            <input
              type="number"
              className="form-control"
              value={expenseId}
              onChange={(e) => setExpenseId(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label>Select Action Type:</label>
            <select
              className="form-control"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="">Select an action type</option>
              <option value="create">Create</option>
              <option value="delete">Delete</option>
              <option value="update">Update</option>
            </select>
          </div>
        </>
      )}
      {(selectedOption === "lastNMinutes" ||
        selectedOption === "lastNHours" ||
        selectedOption === "lastNDays" ||
        selectedOption === "lastNSeconds") && (
        <div className="form-group mb-3">
          <label>Enter Value:</label>
          <input
            type="number"
            className="form-control"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
          />
        </div>
      )}
      {selectedOption === "expenseId" && (
        <div className="form-group mb-3">
          <label>Enter Expense ID:</label>
          <input
            type="number"
            className="form-control"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />
        </div>
      )}
      <div className="form-group mb-3">
        <label>Enter Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary mt-3" onClick={handleSendEmail}>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default AuditLogsEmailSender;

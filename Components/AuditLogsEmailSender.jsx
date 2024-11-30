import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import "../Styles/AuditLogsEmailSender.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmailLoader from "./Loaders/EmailLoader";
import { AuditLogsDataEmail } from "./Input Fields/InputFields";

const AuditLogsEmailSender = () => {
  const [logTypes, setLogTypes] = useState([]);
  const [filteredLogTypes, setFilteredLogTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificDay, setSpecificDay] = useState("");
  const [actionType, setActionType] = useState("");
  const [expenseId, setExpenseId] = useState("");
  const [nMinutes, setNMinutes] = useState("");
  const [nHours, setNHours] = useState("");
  const [nDays, setNDays] = useState("");
  const [nSeconds, setNSeconds] = useState("");
  const suggestionsContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogTypes();
  }, []);

  const fetchLogTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/audit-logs/audit-types"
      );
      setLogTypes(AuditLogsDataEmail);
      setFilteredLogTypes(AuditLogsDataEmail);
    } catch (error) {
      console.error("Error fetching log types:", error);
    }
  };

  const handleChange1 = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterLogTypes(value);
    setSelectedIndex(-1); // Reset the selection index
  };

  const filterLogTypes = (value) => {
    if (value.length > 0) {
      const filtered = logTypes.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLogTypes(filtered);
    } else {
      setFilteredLogTypes(logTypes);
    }
  };

  const handleClick = () => {
    setIsInputClicked(true);
    if (searchTerm.length > 0) {
      const nearestMatch = logTypes.find((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogTypes(nearestMatch ? [nearestMatch] : []);
    }
  };

  const handleBlur = () => {
    setIsInputClicked(false);
    setFilteredLogTypes([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      selectSuggestion();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(filteredLogTypes.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
  };

  const selectSuggestion = () => {
    const selectedSuggestion =
      selectedIndex >= 0
        ? filteredLogTypes[selectedIndex]
        : filteredLogTypes[0]; // Default to the first item if none is selected

    if (selectedSuggestion) {
      setSearchTerm(selectedSuggestion); // Update the input with the selected suggestion
      setFilteredLogTypes([]); // Clear suggestions after selecting
    }
  };

  useEffect(() => {
    if (suggestionsContainerRef.current) {
      const selectedItem =
        suggestionsContainerRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, filteredLogTypes]);

  const handleSendEmail = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }

    setError(""); // Clear any previous errors
    setLoading(true); // Set loading to true

    const { url, params } = getEmailParams();

    if (!url) {
      setLoading(false); // Set loading to false
      return;
    }

    console.log("Sending request to:", url, "with params:", params);

    try {
      const response = await axios.get(url, { params });
      handleClearAll();
      setLoading(false);
      if (response.status === 204) {
        alert("No expenses were found.");
      } else {
        alert("Email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const getEmailParams = () => {
    let url = "";
    let params = { email };

    switch (searchTerm) {
      case "Current Month Logs":
        url = "http://localhost:3000/audit-logs/current-month/email";
        break;
      case "Last Month Logs":
        url = "http://localhost:3000/audit-logs/last-month/email";
        break;
      case "Current Year Logs":
        url = "http://localhost:3000/audit-logs/current-year/email";
        break;
      case "Last Year Logs":
        url = "http://localhost:3000/audit-logs/last-year/email";
        break;
      case "Current Week Logs":
        url = "http://localhost:3000/audit-logs/current-week/email";
        break;
      case "Last Week Logs":
        url = "http://localhost:3000/audit-logs/last-week/email";
        break;
      case "Today Logs":
        url = "http://localhost:3000/audit-logs/today/email";
        break;
      case "Logs for Specific Year":
        url = `http://localhost:3000/audit-logs/year/${specificYear}/email`;
        break;
      case "Logs for Specific Month":
        url = "http://localhost:3000/audit-logs/month/email";
        params.year = specificYear;
        params.month = specificMonth;
        break;
      case "Logs for Specific Day":
        url = "http://localhost:3000/audit-logs/day/email";
        params.date = specificDay;
        break;
      case "Logs by Action Type":
        url = `http://localhost:3000/audit-logs/action/${actionType}/email`;
        break;
      case "Logs by Expense ID and Action Type":
        const parsedExpenseId = parseInt(expenseId, 10);
        if (isNaN(parsedExpenseId)) {
          setError("Expense ID must be an integer.");
          return { url: "", params: {} };
        }
        url = `http://localhost:3000/audit-logs/expense/${parsedExpenseId}/action/${actionType}/email`;
        break;
      case "Logs from Last N Minutes":
        url = "http://localhost:3000/audit-logs/last-n-minutes/email";
        params.minutes = nMinutes;
        break;
      case "Logs from Last N Hours":
        url = "http://localhost:3000/audit-logs/last-n-hours/email";
        params.hours = nHours;
        break;
      case "Logs from Last N Days":
        url = "http://localhost:3000/audit-logs/last-n-days/email";
        params.days = nDays;
        break;
      case "Logs from Last N Seconds":
        url = "http://localhost:3000/audit-logs/last-n-seconds/email";
        params.seconds = nSeconds;
        break;
      case "Logs from Last 5 Minutes":
        url = "http://localhost:3000/audit-logs/last-5-minutes/email";
        break;
      case "All Audit Logs":
        url = "http://localhost:3000/audit-logs/all/email";
        break;
      case "Logs by Expense ID":
        const parsedExpenseId1 = parseInt(expenseId, 10);
        if (isNaN(parsedExpenseId1)) {
          setError("Expense ID must be an integer.");
          return { url: "", params: {} };
        }
        url = `http://localhost:3000/audit-logs/expenses/${parsedExpenseId1}/email`;
        break;
      default:
        setError("Please select a valid option.");
        return { url: "", params: {} };
    }

    return { url, params };
  };

  const handleClearAll = () => {
    // Reset all state variables
    setSearchTerm("");
    setSpecificYear("");
    setSpecificMonth("");
    setSpecificDay("");
    setActionType("");
    setExpenseId("");
    setNMinutes("");
    setNHours("");
    setNDays("");
    setNSeconds("");
    setError("");
    setEmail("");
    setFilteredLogTypes(logTypes); // Reset suggestions to default
    setSelectedIndex(-1);
  };

  if (loading) {
    return <div className="loader-container">{<EmailLoader />}</div>;
  }

  return (
    <div className="audit-container">
      <div className="error-message">
        {error && (
          <div className="error-message-div">
            <div className="error-icon-div">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="me-2 error-icon"
              />
            </div>
            <div className="error-message">
              <p className="text-danger mt-3 fw-bold">{error}</p>
            </div>
          </div>
        )}
      </div>
      <div className="width main-text">
        <p className="filters-text">Filters</p>
        <p className="clear-all-text" onClick={handleClearAll}>
          Clear All
        </p>
      </div>
      <div className="header">
        <h5>Send Audit Logs by Email</h5>
      </div>
      <div className="mb-3">
        <div
          style={{ position: "relative", width: "100%" }}
          className="audit-expense-period-div"
        >
          <input
            type="text"
            className="log-period"
            value={searchTerm}
            onChange={handleChange1}
            onClick={handleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Search log period..."
            style={{
              marginTop: "5px",
              fontFamily: "Arial, sans-serif",
              zIndex: 1,
            }}
          />
          {isInputClicked && filteredLogTypes.length > 0 && (
            <div
              ref={suggestionsContainerRef}
              style={{
                position: "absolute",
                top: "100%",
                left: "1vw",
                width: "18vw",
                border: "1px solid white",
                borderTop: "none",
                backgroundColor: "white",
                zIndex: 10,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxHeight: "200px",
                overflowY: "auto",
                borderRadius: "0 0 5px 5px",
                scrollbarWidth: "thin",
                scrollbarColor: "#A7C4C2 transparent",
              }}
            >
              {filteredLogTypes.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    backgroundColor:
                      selectedIndex === index ? "#79E0EE" : "transparent",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseDown={() => setSearchTerm(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {searchTerm === "Logs for Specific Year" && (
        <div className="mb-3">
          <input
            type="number"
            className="log-period"
            value={specificYear}
            placeholder="Enter a specific year"
            onChange={(e) => setSpecificYear(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs for Specific Month" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period mb-3"
            value={specificYear}
            placeholder="Enter Year"
            onChange={(e) => setSpecificYear(e.target.value)}
          />
          <input
            type="number"
            className="log-period"
            value={specificMonth}
            placeholder="Enter Month"
            onChange={(e) => setSpecificMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs for Specific Day" && (
        <div className="form-group mb-3">
          <label className="label">Enter Date</label>
          <input
            type="date"
            className="form-control width mb-4"
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs by Action Type" && (
        <div className="form-group mb-3">
          <select
            className="log-period"
            placeholder="Enter Action Type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}
      {searchTerm === "Logs by Expense ID and Action Type" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period mb-3"
            placeholder="Enter Expense ID"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />
          <select
            className="log-period"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}
      {searchTerm === "Logs from Last N Minutes" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Minutes Number"
            value={nMinutes}
            onChange={(e) => setNMinutes(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Hours" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Hours Number"
            value={nHours}
            onChange={(e) => setNHours(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Days" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter the number of days"
            value={nDays}
            onChange={(e) => setNDays(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Seconds" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Seconds..."
            value={nSeconds}
            onChange={(e) => setNSeconds(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs by Expense ID" && (
        <div className="form-group mb-3">
          <input
            type="number"
            className="log-period"
            placeholder="Enter Expense ID"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />
        </div>
      )}
      <div className="form-group mb-3">
        <input
          type="email"
          className="log-period"
          value={email}
          placeholder="Enter Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button className="send-mail-btn mt-3 width" onClick={handleSendEmail}>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default AuditLogsEmailSender;

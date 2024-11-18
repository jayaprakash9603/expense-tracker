import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { faAlignCenter } from "@fortawesome/free-solid-svg-icons";

const AuditLogsEmailSender = () => {
  const [logTypes, setLogTypes] = useState([]);
  const [filteredLogTypes, setFilteredLogTypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificDay, setSpecificDay] = useState("");
  const [actionType, setActionType] = useState("create");
  const [expenseId, setExpenseId] = useState("");
  const [nMinutes, setNMinutes] = useState("");
  const [nHours, setNHours] = useState("");
  const [nDays, setNDays] = useState("");
  const [nSeconds, setNSeconds] = useState("");
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/audit-logs/log-types")
      .then((response) => {
        setLogTypes(response.data);
        setFilteredLogTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching log types:", error);
      });
  }, []);

  const handleChange1 = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = logTypes.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLogTypes(filtered);
    } else {
      setFilteredLogTypes(logTypes);
    }

    setSelectedIndex(-1); // Reset the selection index
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
      const selectedSuggestion =
        selectedIndex >= 0
          ? filteredLogTypes[selectedIndex]
          : filteredLogTypes[0]; // Default to the first item if none is selected

      if (selectedSuggestion) {
        setSearchTerm(selectedSuggestion); // Update the input with the selected suggestion
        setFilteredLogTypes([]); // Clear suggestions after selecting
      }
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

  const handleSendEmail = () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }

    setError(""); // Clear any previous errors

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
        params.year = specificYear; // Use specificYear state variable
        params.month = specificMonth; // Use specificMonth state variable
        break;
      case "Logs for Specific Day":
        url = "http://localhost:3000/audit-logs/day/email";
        params.date = specificDay; // Use specificDay state variable
        break;
      case "Logs by Action Type":
        url = "http://localhost:3000/audit-logs/action/${actiontype}/email"; // Use actionType state variable
        break;
      case "Logs by Expense ID and Action Type":
        const parsedExpenseId = parseInt(expenseId, 10);
        if (isNaN(parsedExpenseId)) {
          setError("Expense ID must be an integer.");
          return;
        }
        url = `http://localhost:3000/audit-logs/expense/${parsedExpenseId}/action/${actionType}/email`;
        break;
      case "Logs from Last N Minutes":
        url = "http://localhost:3000/audit-logs/last-n-minutes/email";
        params.minutes = nMinutes; // Use nMinutes state variable
        break;
      case "Logs from Last N Hours":
        url = "http://localhost:3000/audit-logs/last-n-hours/email";
        params.hours = nHours; // Use nHours state variable
        break;
      case "Logs from Last N Days":
        url = "http://localhost:3000/audit-logs/last-n-days/email";
        params.days = nDays; // Use nDays state variable
        break;
      case "Logs from Last N Seconds":
        url = "http://localhost:3000/audit-logs/last-n-seconds/email";
        params.seconds = nSeconds; // Use nSeconds state variable
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
          return;
        }
        url = `http://localhost:3000/audit-logs/expenses/${parsedExpenseId1}/email`;
        break;
      default:
        setError("Please select a valid option.");
        return;
    }

    console.log("Sending request to:", url, "with params:", params);

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
    <div
      className="container bg-white mt-5"
      style={{ height: "450px", width: "600px" }}
    >
      <h2 style={faAlignCenter}>Send Audit Logs by Email</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group mb-3">
        <label>Search Log Period:</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={handleChange1}
            onClick={handleClick}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Search log period..."
            style={{
              width: "100%",
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
                left: 0,
                width: "100%",
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
        <div className="form-group mb-3">
          <label>Enter Year:</label>
          <input
            type="number"
            className="form-control"
            value={specificYear}
            onChange={(e) => setSpecificYear(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs for Specific Month" && (
        <div className="form-group mb-3">
          <label>Enter Year:</label>
          <input
            type="number"
            className="form-control"
            value={specificYear}
            onChange={(e) => setSpecificYear(e.target.value)}
          />
          <label>Enter Month:</label>
          <input
            type="number"
            className="form-control"
            value={specificMonth}
            onChange={(e) => setSpecificMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs for Specific Day" && (
        <div className="form-group mb-3">
          <label>Enter Date (yyyy-MM-dd):</label>
          <input
            type="date"
            className="form-control"
            value={specificDay}
            onChange={(e) => setSpecificDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs by Action Type" && (
        <div className="form-group mb-3">
          <label>Enter Action Type:</label>
          <select
            className="form-control"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}
      {searchTerm === "Logs by Expense ID and Action Type" && (
        <div className="form-group mb-3">
          <label>Enter Expense ID:</label>
          <input
            type="number"
            className="form-control"
            value={expenseId}
            onChange={(e) => setExpenseId(e.target.value)}
          />
          <label>Enter Action Type:</label>
          <select
            className="form-control"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      )}
      {searchTerm === "Logs from Last N Minutes" && (
        <div className="form-group mb-3">
          <label>Enter N Minutes:</label>
          <input
            type="number"
            className="form-control"
            value={nMinutes}
            onChange={(e) => setNMinutes(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Hours" && (
        <div className="form-group mb-3">
          <label>Enter N Hours:</label>
          <input
            type="number"
            className="form-control"
            value={nHours}
            onChange={(e) => setNHours(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Days" && (
        <div className="form-group mb-3">
          <label>Enter N Days:</label>
          <input
            type="number"
            className="form-control"
            value={nDays}
            onChange={(e) => setNDays(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs from Last N Seconds" && (
        <div className="form-group mb-3">
          <label>Enter N Seconds:</label>
          <input
            type="number"
            className="form-control"
            value={nSeconds}
            onChange={(e) => setNSeconds(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Logs by Expense ID" && (
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

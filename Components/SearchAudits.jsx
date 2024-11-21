import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/SearchAudits.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchAudits = ({ Url, setUrl }) => {
  const [logTypes, setLogTypes] = useState([]);
  const [filteredLogTypes, setFilteredLogTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificDay, setSpecificDay] = useState("");
  const suggestionsContainerRef = useRef(null);
  const [expenseId, setExpenseId] = useState("");
  const [actionType, setActionType] = useState("");
  const [nMinutes, setNMinutes] = useState("");
  const [nSeconds, setNSeconds] = useState("");
  const [nHours, setNHours] = useState("");
  const [nDays, setNDays] = useState("");

  useEffect(() => {
    const fetchLogTypes = () => {
      axios
        .get("http://localhost:3000/audit-logs/audit-types")
        .then((response) => {
          setLogTypes(response.data);
          setFilteredLogTypes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching log types:", error);
        });
    };

    fetchLogTypes();
    const interval = setInterval(fetchLogTypes, 1000000);

    return () => clearInterval(interval);
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

    setSelectedIndex(-1);
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
      e.preventDefault();
      const selectedSuggestion =
        selectedIndex >= 0
          ? filteredLogTypes[selectedIndex]
          : filteredLogTypes[0];

      if (selectedSuggestion) {
        setSearchTerm(selectedSuggestion);
        setFilteredLogTypes([]);
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

  const handleShowExpenses = () => {
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

  const handleClearAll = () => {
    setSearchTerm("");
    setSpecificYear("");
    setSpecificMonth("");
    setSpecificDay("");
    setExpenseId("");
    setActionType("");
    setNMinutes("");
    setNSeconds("");
    setNHours("");
    setNDays("");
    setUrl("");
    setError("");
    setFilteredLogTypes(logTypes);
    setSelectedIndex(-1);
  };

  return (
    <div className="bg-white mt-0 d-flex flex-row">
      <div className="search-input">
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
        <div className="form-group mb-3">
          <div
            style={{ position: "relative" }}
            className="search-expense-period-div"
          >
            <input
              type="text"
              className="search-expense-period"
              value={searchTerm}
              onChange={handleChange1}
              onClick={handleClick}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              placeholder="Search expense period..."
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
                  left: "1vw",
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

        <div className="show-button">
          <button
            className=" mt-3 send-mail-btn"
            style={{
              width: "18vw",
              border: "none",
              outline: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "rgb(250, 113, 113)",
            }}
            onClick={handleShowExpenses}
          >
            Show Expenses
          </button>
        </div>
        {console.log(Url)}
      </div>
    </div>
  );
};

export default SearchAudits;

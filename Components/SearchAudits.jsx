import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toDate } from "date-fns";
import ExpenseTableParent from "./ExpenseTableParent";
import "../Styles/SearchAudits.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
const SearchAudits = () => {
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
  const suggestionsContainerRef = useRef(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [expenseId, setExpenseId] = useState("");
  const [actionType, setActionType] = useState("");
  const [nMinutes, setNMinutes] = useState("");
  const [nSeconds, setNSeconds] = useState("");
  const [nHours, setNHours] = useState("");
  const [nDays, setNDays] = useState("");

  const [Url, setUrl] = useState("");

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

    fetchLogTypes(); // Call it once initially
    const interval = setInterval(fetchLogTypes, 1000000); // Call it every 5 seconds

    // Cleanup interval on component unmount
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

  const handleShowExpenses = () => {
    setError("");

    let url = "";
    let params = {};

    switch (searchTerm) {
      case "Today":
        url = "http://localhost:3000/expenses/today";
        break;

      case "Yesterday":
        url = "http://localhost:3000/expenses/yesterday";
        break;

      case "Last Week":
        url = "http://localhost:3000/expenses/last-week";
        break;

      case "Current Week":
        url = "http://localhost:3000/expenses/current-week";
        break;

      case "Current Month":
        url = "http://localhost:3000/expenses/current-month";
        break;

      case "Last Month":
        url = "http://localhost:3000/expenses/last-month";
        break;

      case "All Expenses":
        url = "http://localhost:3000/fetch-expenses";
        break;

      case "Monthly Summary":
        if (!specificYear || !specificMonth) {
          setError(
            "Please provide both year and month for the Monthly Summary."
          );
          return;
        }
        url = `http://localhost:3000/monthly-summary/${specificYear}/${specificMonth}`;
        break;

      case "Within Range Expenses":
        if (!fromDay || !toDay) {
          setError("Please provide both From and To dates");
          return;
        }
        url = "http://localhost:3000/fetch-expenses-by-date";
        params.from = fromDay;
        params.to = toDay;
        break;

      case "Expenses By Name":
        if (!expenseName) {
          setError("Please provide an expense name");
          return;
        }
        url = "http://localhost:3000/expenses/search";
        params.expenseName = expenseName;
        break;

      case "Expenses By Payment Method":
        if (!paymentMethod) {
          setError("Please provide a payment method.");
          return;
        }
        url = `http://localhost:3000/payment-method/${paymentMethod}`;
        break;

      case "Expenses By Type and Payment Method":
        if (!category || !paymentMethod) {
          setError("Please provide type and payment");
          return;
        }
        url = `http://localhost:3000/expenses/${category}/${paymentMethod}`;
        break;

      case "Expenses By Type":
        if (!category) {
          setError("Please provide a category");
          return;
        }
        url = `http://localhost:3000/expenses/${category}`;
        break;

      case "Particular Month Expenses":
        if (!startMonth || !startYear) {
          setError("Please provide month and year");
          return;
        }
        url = `http://localhost:3000/expenses/by-month`;
        params.month = startMonth;
        params.year = startYear;
        break;

      case "Expenses Within Amount Range":
        if (!minAmount || !maxAmount) {
          setError("Please provide min or max value.");
          return;
        }
        url = `http://localhost:3000/expenses/amount-range`;
        params.minAmount = minAmount;
        params.maxAmount = maxAmount;
        break;

      case "Particular Date Expenses":
        if (!fromDay) {
          setError("Please provide a date");
          return;
        }
        url = `http://localhost:3000/expenses/particular-date`;
        params.date = fromDay;
        break;

      default:
        setError("Please select a valid option.");
        return;
    }

    // Append params to the URL if any
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams(params).toString();
      url = `${url}?${queryParams}`;
    }

    console.log("Sending request to:", url, "with params:", params);
    setUrl(url);
  };

  const handleClearAll = () => {
    // Reset all state variables
    setSearchTerm("");
    setSpecificYear("");
    setSpecificMonth("");
    setSpecificDay("");
    setStartYear("");
    setEndYear("");
    setStartMonth("");
    setEndMonth("");
    setFromDay("");
    setToDay("");
    setExpenseName("");
    setPaymentMethod("");
    setCategory("");
    setMinAmount("");
    setMaxAmount("");
    setUrl("");
    setError("");
    setFilteredLogTypes(logTypes); // Reset suggestions to default
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
            style={{ width: "18vw" }}
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

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/ExpensesEmail.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmailLoader from "./Loaders/EmailLoader";

const ExpensesEmail = () => {
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
  const [loading, setLoading] = useState(false);
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    fetchLogTypes();
  }, []);

  const fetchLogTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/expenses/expenses-types"
      );
      setLogTypes(response.data);
      setFilteredLogTypes(response.data);
    } catch (error) {
      console.error("Error fetching log types:", error);
    }
  };

  const handleChange1 = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterLogTypes(value);
    setSelectedIndex(-1);
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
      e.preventDefault();
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
        : filteredLogTypes[0];
    if (selectedSuggestion) {
      setSearchTerm(selectedSuggestion);
      setFilteredLogTypes([]);
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

    setError("");
    setLoading(true);

    const { url, params } = getEmailParams();

    if (!url) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, { params });
      setLoading(false);
      if (response.status === 204) {
        alert("No summaries were found.");
      } else {
        alert("Email sent successfully!");
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
      }
    }
  };

  const getEmailParams = () => {
    let url = "";
    let params = { email };

    switch (searchTerm) {
      case "Today":
        url = "http://localhost:3000/expenses/today/email";
        break;
      case "Yesterday":
        url = "http://localhost:3000/expenses/yesterday/email";
        break;
      case "Last Week":
        url = "http://localhost:3000/expenses/current-week/email";
        break;
      case "Current Week":
        url = "http://localhost:3000/expenses/last-week/email";
        break;
      case "Current Month":
        url = "http://localhost:3000/expenses/current-month/email";
        break;
      case "Last Month":
        url = "http://localhost:3000/expenses/last-month/email";
        break;
      case "All Expenses":
        url = "http://localhost:3000/fetch-expenses/email";
        break;
      case "Monthly Summary":
        url = `http://localhost:3000/monthly-summary/${specificYear}/${specificMonth}/email`;
        break;
      case "Within Range Expenses":
        url = `http://localhost:3000/fetch-expenses-by-date/email`;
        params.from = fromDay;
        params.to = toDay;
        break;
      case "Expenses By Name":
        url = "http://localhost:3000/expenses/search/email";
        params.expenseName = expenseName;
        break;
      case "Expenses By Payment Method":
        url = `http://localhost:3000/payment-method/${paymentMethod}/email`;
        break;
      case "Expenses By Type and Payment Method":
        url = `http://localhost:3000/expenses/${category}/${paymentMethod}/email`;
        break;
      case "Expenses Within Amount Range":
        url = `http://localhost:3000/expenses/amount-range/email`;
        params.minAmount = minAmount;
        params.maxAmount = maxAmount;
        break;
      case "Particular Month Expenses":
        url = `http://localhost:3000/expenses/by-month/email`;
        params.month = startMonth;
        params.year = startYear;
        break;
      case "Particular Date Expenses":
        url = `http://localhost:3000/expenses/date/email`;
        params.date = fromDay;
        break;
      default:
        setError("Please select a valid option.");
        return { url: "", params: {} };
    }

    return { url, params };
  };

  const handleClearAll = () => {
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
    setError("");
    setFilteredLogTypes(logTypes);
    setSelectedIndex(-1);
    setEmail("");
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
        <h5>Send Expenses by Email</h5>
      </div>
      <div className="form-group mb-3">
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
            placeholder="Search expense period..."
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
      {searchTerm === "Particular Date Expenses" && (
        <div className="form-group mb-3">
          <label className="label">Enter Date</label>
          <input
            type="date"
            className="log-period"
            value={fromDay}
            onChange={(e) => setFromDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Particular Month Expenses" && (
        <div className="form-group mb-3">
          <label className="label">Enter Start Year:</label>
          <input
            type="number"
            className="log-period mb-3"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <label className="label">Enter Start Month:</label>
          <input
            type="number"
            className="log-period mb-3"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Name" && (
        <div className="form-group mb-3">
          <input
            type="text"
            className="log-period"
            value={expenseName}
            placeholder="Enter Expense Name"
            onChange={(e) => setExpenseName(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Payment Method" && (
        <div className="form-group mb-3 ">
          <select
            className="log-period"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Select Payment Method --</option>
            <option value="cash">Cash</option>
            <option value="creditNeedToPaid">Credit Due</option>
            <option value="creditPaid">Credit Paid</option>
          </select>
        </div>
      )}
      {searchTerm === "Within Range Expenses" && (
        <div className="form-group mb-3">
          <label className="label">From Date</label>
          <input
            type="date"
            className="log-period mb-3"
            value={fromDay}
            onChange={(e) => setFromDay(e.target.value)}
          />
          <label className="label">To Date</label>
          <input
            type="date"
            className="log-period mb-3"
            value={toDay}
            onChange={(e) => setToDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Type and Payment Method" && (
        <div className="form-group mb-3">
          <select
            className="log-period mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            <option value="loss">Loss</option>
            <option value="gain">Gain</option>
          </select>

          <select
            className="log-period"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">-- Select Payment Method --</option>
            <option value="cash">Cash</option>
            <option value="creditNeedToPaid">Credit Due</option>
            <option value="creditPaid">Credit Paid</option>
          </select>
        </div>
      )}
      {searchTerm === "Expenses Within Amount Range" && (
        <div className="form-group mb-3">
          <input
            type="number"
            step="0.01"
            className="log-period mb-3"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="Enter minimum amount"
          />
          <input
            type="number"
            step="0.01"
            className="log-period"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Enter maximum amount"
          />
        </div>
      )}
      <div className="form-group mb-3">
        <input
          type="email"
          className="log-period"
          value={email}
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button className="send-mail-btn width mt-3" onClick={handleSendEmail}>
          Send Email
        </button>
      </div>
    </div>
  );
};

export default ExpensesEmail;

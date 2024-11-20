import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toDate } from "date-fns";

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

  useEffect(() => {
    axios
      .get("http://localhost:3000/expenses/expenses-types")
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
        // params.date = parsedDate;
        break;
      case "Particular Month Expenses":
        url = `http://localhost:3000/expenses/by-month/email`;
        params.month = startMonth;
        params.year = startYear;
        // params.date = parsedDate;
        break;
      case "Particular Date Expenses":
        url = `http://localhost:3000/expenses/date/email`;
        params.date = fromDay;
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
          alert("No summaries were found.");
        } else {
          alert("Email sent successfully!");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error("Error sending email:", error);
          alert("Failed to send email.");
        }
      });
  };

  return (
    <div
      className="container bg-white mt-5"
      style={{ height: "450px", width: "600px" }}
    >
      <h2>Send Expenses by Email</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group mb-3">
        <label>Search Expense Period:</label>
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
      {searchTerm === "Particular Date Expenses" && (
        <div className="form-group mb-3">
          <label>Enter Date (yyyy-MM-dd):</label>
          <input
            type="date"
            className="form-control"
            value={fromDay}
            onChange={(e) => setFromDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Particular Month Expenses" && (
        <div className="form-group mb-3">
          <label>Enter Start Year:</label>
          <input
            type="number"
            className="form-control"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <label>Enter Start Month:</label>
          <input
            type="number"
            className="form-control"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Name" && (
        <div className="form-group mb-3">
          <label>Enter Expense Name:</label>
          <input
            type="text"
            className="form-control"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Payment Method" && (
        <div className="form-group mb-3">
          <label>Select Payment Method:</label>
          <select
            className="form-control"
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
          <label>Enter From Date (yyyy-MM-dd):</label>
          <input
            type="date"
            className="form-control"
            value={fromDay}
            onChange={(e) => setFromDay(e.target.value)}
          />
          <label>Enter To Date (yyyy-MM-dd):</label>
          <input
            type="date"
            className="form-control"
            value={toDay}
            onChange={(e) => setToDay(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Expenses By Type and Payment Method" && (
        <div className="form-group mb-3">
          <label>Select Category:</label>
          <select
            className="form-control mb-3"
            value={category} // State variable for the first dropdown
            onChange={(e) => setCategory(e.target.value)} // Update the setter accordingly
          >
            <option value="">-- Select Category --</option>
            <option value="loss">Loss</option>
            <option value="gain">Gain</option>
          </select>

          <label>Select Payment Method:</label>
          <select
            className="form-control"
            value={paymentMethod} // State variable for the second dropdown
            onChange={(e) => setPaymentMethod(e.target.value)} // Update the setter accordingly
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
          <label>Enter Minimum Amount:</label>
          <input
            type="number"
            step="0.01"
            className="form-control mb-3"
            value={minAmount} // State variable for min amount
            onChange={(e) => setMinAmount(e.target.value)} // Update the setter for min amount
            placeholder="Enter minimum amount"
          />

          <label>Enter Maximum Amount:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={maxAmount} // State variable for max amount
            onChange={(e) => setMaxAmount(e.target.value)} // Update the setter for max amount
            placeholder="Enter maximum amount"
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

export default ExpensesEmail;
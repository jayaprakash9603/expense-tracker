import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/SearchExpenses.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchExpenses = ({ Url, setUrl }) => {
  const [logTypes, setLogTypes] = useState([]);
  const [filteredLogTypes, setFilteredLogTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    const fetchLogTypes = () => {
      axios
        .get("http://localhost:3000/expenses/expenses-types")
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
    setFromDay("");
    setToDay("");
    setExpenseName("");
    setPaymentMethod("");
    setCategory("");
    setMinAmount("");
    setMaxAmount("");
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
        {searchTerm === "Particular Date Expenses" && (
          <div className="form-group mb-3 width">
            <input
              type="date"
              className="form-control"
              value={fromDay}
              onChange={(e) => setFromDay(e.target.value)}
              title="Enter Date (yyyy-MM-dd)"
            />
          </div>
        )}
        {searchTerm === "Particular Month Expenses" && (
          <div className="form-group mb-3 width">
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
          <div className="form-group mb-3 width">
            <input
              type="text"
              className="form-control"
              value={expenseName}
              placeholder="Enter expense name"
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>
        )}
        {searchTerm === "Expenses By Payment Method" && (
          <div className="form-group mb-3 width">
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
          <div className="form-group mb-3 width">
            <div className="from-date">
              <label>From</label>
              <input
                type="date"
                className="form-control"
                value={fromDay}
                onChange={(e) => setFromDay(e.target.value)}
              />
            </div>
            <div className="to-date">
              <label>To</label>
              <input
                type="date"
                className="form-control"
                value={toDay}
                onChange={(e) => setToDay(e.target.value)}
              />
            </div>
          </div>
        )}
        {searchTerm === "Expenses By Type and Payment Method" && (
          <div className="form-group mb-3">
            <div className="width">
              <select
                className="form-control mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                <option value="loss">Loss</option>
                <option value="gain">Gain</option>
              </select>
            </div>
            <div className="width">
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
          </div>
        )}
        {searchTerm === "Expenses By Type" && (
          <div className="form-group mb-3">
            <div className="width">
              <select
                className="form-control mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                <option value="loss">Loss</option>
                <option value="gain">Gain</option>
              </select>
            </div>
          </div>
        )}
        {searchTerm === "Expenses Within Amount Range" && (
          <div className="form-group mb-3 ">
            <div className="width">
              <input
                type="number"
                step="0.01"
                className="form-control mb-3"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Enter minimum amount"
              />
            </div>
            <div className="width">
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Enter maximum amount"
              />
            </div>
          </div>
        )}
        <div className="">
          <button
            className="send-email-btn mt-3"
            style={{
              width: "18vw",
              marginLeft: "1vw",
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

export default SearchExpenses;

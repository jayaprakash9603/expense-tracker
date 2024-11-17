import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ExpenseSummaryEmailSender = () => {
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/expenses/summary-types")
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
      case "Monthly Wise Daily Expense Summary":
        url = "http://localhost:3000/daily-summary/monthly/email";
        params.year = specificYear;
        params.month = specificMonth;
        break;
      case "Monthly Summary":
        url = `http://localhost:3000/monthly-summary/${specificYear}/${specificMonth}/email`;
        break;
      case "Summary Between Dates":
        url = `http://localhost:3000/between-dates/email`;
        params.startMonth = startMonth;
        params.startYear = startYear;
        params.endMonth = endMonth;
        params.endYear = endYear;
        break;
      case "Payment Method Summary":
        url = "http://localhost:3000/payment-method-summary";
        break;
      case "Yearly Wise Daily Expense Summary":
        const parsedYear = parseInt(specificYear, 10);
        if (isNaN(parsedYear)) {
          setError("Year must be an integer.");
          return;
        }
        url = `http://localhost:3000/daily-summary/yearly/email`;
        params.year = parsedYear;
        break;
      case "Yearly Summary":
        const parsedYear1 = parseInt(specificYear, 10);
        if (isNaN(parsedYear1)) {
          setError("Year must be an integer.");
          return;
        }
        url = `http://localhost:3000/daily-summary/yearly/email`;
        params.year = parsedYear1;
        break;
      case "Expense Summary for Specific Date":
        const parsedDate = specificDay;
        if (!parsedDate) {
          setError("Date must be provided.");
          return;
        }
        url = `http://localhost:3000/daily-summary/date/email/${parsedDate}`;
        // params.date = parsedDate;
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
    <div className="container mt-5" style={{ height: "450px", width: "600px" }}>
      <h2>Send Expense Summaries by Email</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group mb-3">
        <label>Search Summary Period:</label>
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
            placeholder="Search summary period..."
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
      {searchTerm === "Monthly Wise Daily Expense Summary" && (
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
      {searchTerm === "Summary Between Dates" && (
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
          <label>Enter End Year:</label>
          <input
            type="number"
            className="form-control"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
          <label>Enter End Month:</label>
          <input
            type="number"
            className="form-control"
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
          />
        </div>
      )}
      {searchTerm === "Yearly Wise Daily Expense Summary" && (
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
      {searchTerm === "Yearly Summary" && (
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
      {searchTerm === "Expense Summary for Specific Date" && (
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
      {searchTerm === "Payment Method Summary" && (
        <div className="form-group mb-3"></div>
      )}
      {searchTerm === "Monthly Summary" && (
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

export default ExpenseSummaryEmailSender;

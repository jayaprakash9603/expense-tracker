import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateExpense from "./CreateExpense";
import ExpenseFormLogic from "./ExpenseFormLogic";
import { useDispatch } from "react-redux";
import {
  createExpenseAction,
  getExpensesAction,
} from "./Redux/Expenses/expense.action";

function CreateExpenses() {
  const initialState = {
    expenseName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "loss", // Default to loss
    paymentMethod: "cash",
    comments: "",
  };
  const CREDIT_NEED_TO_PAID = "creditNeedToPaid";
  const CREDIT_PAID = "creditPaid";
  const GAIN = "gain";
  const {
    formState,
    setFormState,
    error,
    setError,
    isSalaryDate,
    validateForm,
  } = ExpenseFormLogic(initialState);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const suggestionsContainerRef = useRef(null);

  const [finalData, setFinalData] = useState(null);
  const methodMapping = {
    cash: "cash",
    creditNeedToPaid: "creditNeedToPaid",
    creditPaid: "creditPaid",
  };
  const methodMapping1 = {
    cash: "Cash",
    creditNeedToPaid: "Credit Due",
    creditPaid: "Credit Paid",
  };
  useEffect(() => {
    axios
      .get("http://localhost:3000/top-payment-methods")
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const mappedMethods = response.data.map(
            (method) => methodMapping[method] || method
          );
          setPaymentMethods(mappedMethods);
          setFormState((prevState) => ({
            ...prevState,
            paymentMethod: mappedMethods[0], // Set payment method to the first item
          }));
        } else {
          const defaultMethods = ["cash", "creditNeedToPaid", "creditPaid"];
          const mappedMethods = defaultMethods.map(
            (method) => methodMapping[method]
          );
          setPaymentMethods(mappedMethods);
          setFormState((prevState) => ({
            ...prevState,
            paymentMethod: mappedMethods[0], // Ensure default method is set
          }));
        }
      })
      .catch((error) => {
        const defaultMethods = ["cash", "creditNeedToPaid", "creditPaid"];
        const mappedMethods = defaultMethods.map(
          (method) => methodMapping[method]
        );
        setPaymentMethods(mappedMethods);
        setFormState((prevState) => ({
          ...prevState,
          paymentMethod: mappedMethods[0], // Set payment method to default
        }));
      });
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/expenses/top-expense-names?topN=500"
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  {
    console.log(formState);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Extract values from formState
    const { expenseName, amount, date, type, paymentMethod, comments } =
      formState;

    // Calculate netAmount based on expense type
    const netAmount = type === GAIN ? parseFloat(amount) : -parseFloat(amount);

    // Determine creditDue based on payment method
    let creditDue = 0;
    if (paymentMethod === CREDIT_NEED_TO_PAID) {
      creditDue = parseFloat(amount);
    } else if (paymentMethod === CREDIT_PAID) {
      creditDue = -parseFloat(amount);
    }

    // Create the newExpense object
    const newExpense = {
      expenseName,
      amount: parseFloat(amount),
      type,
      paymentMethod,
      netAmount,
      creditDue,
      comments,
    };

    // Send the request to the backend
    try {
      dispatch(
        createExpenseAction({
          date,
          expense: newExpense,
        })
      );

      navigate("/"); // Navigate to the appropriate page after submission
      dispatch(getExpensesAction());
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data || error.message
      );
      setError("There was an error adding your expense. Please try again.");
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormState((prevState) => {
      // If the value is for paymentMethod, we need to make sure we update correctly
      if (id === "paymentMethod") {
        return {
          ...prevState,
          [id]: value,
        };
      } else {
        return {
          ...prevState,
          [id]: value,
        };
      }
    });
  };
  const handleDateChange = (e) => {
    const { value } = e.target;
    const newDate = new Date(value);
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    );
    let salaryDate = lastDayOfMonth;

    if (salaryDate.getDay() === 6) {
      // If it's Saturday, adjust to Friday
      salaryDate.setDate(salaryDate.getDate() - 1);
    } else if (salaryDate.getDay() === 0) {
      // If it's Sunday, adjust to Friday
      salaryDate.setDate(salaryDate.getDate() - 2);
    }

    const isSalary = newDate.toDateString() === salaryDate.toDateString();

    setFormState((prevState) => ({
      ...prevState,
      date: value,
      type: isSalary ? "gain" : "loss", // Ensure type is set correctly
    }));
  };
  // Update state and filter suggestions on change
  const handleChange1 = (e) => {
    const value = e.target.value;
    setFormState((prevExpenses) => ({
      ...prevExpenses,
      expenseName: value,
    }));

    if (value.length > 0) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }

    setSelectedIndex(-1); // Reset the selection index
  };

  const handleClick = () => {
    setIsInputClicked(true);
    if (formState.expenseName.length > 0) {
      const nearestMatch = suggestions.find((item) =>
        item.toLowerCase().includes(formState.expenseName.toLowerCase())
      );
      setFilteredSuggestions(nearestMatch ? [nearestMatch] : []);
    }
  };

  const handleBlur = () => {
    setIsInputClicked(false);
    setFilteredSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      const selectedSuggestion =
        selectedIndex >= 0
          ? filteredSuggestions[selectedIndex]
          : filteredSuggestions[0]; // Default to the first item if none is selected

      if (selectedSuggestion) {
        setFormState((prevExpenses) => ({
          ...prevExpenses,
          expenseName: selectedSuggestion, // Update the input with the selected suggestion
        }));
        setFilteredSuggestions([]); // Clear suggestions after selecting
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(filteredSuggestions.length - 1, prevIndex + 1)
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
  }, [selectedIndex, filteredSuggestions]);

  useEffect(() => {
    fetchSuggestions();
  }, []);
  const handleKeyDown1 = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Add an Expense</h1>
        <form onKeyDown={handleKeyDown1} onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="expenseName">Expense Name:</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                id="expenseName"
                className="form-control"
                value={formState.expenseName}
                onChange={handleChange1} // Trigger handleChange on input change
                onClick={handleClick}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="Search expense name..."
                style={{
                  width: "100%",
                  marginTop: "5px",
                  // padding: "10px",
                  // borderRadius: "5px",
                  // border: "2px solid #6A42C2",
                  // boxSizing: "border-box",
                  // fontSize: "14px",
                  // backgroundColor: "white",
                  // color: "#333",
                  fontFamily: "Arial, sans-serif",
                  zIndex: 1,
                }}
              />
              {isInputClicked && filteredSuggestions.length > 0 && (
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
                  {filteredSuggestions.map((item, index) => (
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
                      onMouseDown={() => setFormState(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              placeholder="Enter Amount"
              value={formState.amount}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={formState.date}
              onChange={handleDateChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type">Transaction Type:</label>
            <select
              id="type"
              className="form-select"
              value={formState.type}
              onChange={handleChange}
            >
              <option value="gain">Gain</option>
              <option value="loss">Loss</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="paymentMethod">Payment Method:</label>
            <select
              id="paymentMethod"
              className="form-select"
              value={formState.paymentMethod}
              onChange={handleChange}
            >
              {paymentMethods.map((method, index) => (
                <option key={index} value={method}>
                  {methodMapping1[method] || method}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              className="form-control"
              placeholder="Enter any comments"
              value={formState.comments}
              onChange={handleChange}
            ></textarea>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" type="submit">
              Add Expense
            </button>
            <Link to="/" className="btn btn-primary ms-3">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateExpenses;

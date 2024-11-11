import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const convertToNewFormat = (data) => {
  return data.reduce((acc, { id, date, expense }) => {
    if (!acc[date]) {
      acc[date] = [];
    }
    const index = acc[date].length + 1;

    acc[date].push({
      id: id,
      index: index,
      expenseName: expense.expenseName,
      amount: expense.amount,
      type: expense.type,
      paymentMethod: expense.paymentMethod,
      netAmount: expense.netAmount,
      creditDue: expense.creditDue,
      comments: expense.comments || "", // Include creditDue here
    });

    return acc;
  }, {});
};

const convertToOldFormat = (data) => {
  return Object.entries(data).flatMap(([date, expensesArray]) =>
    expensesArray.map(
      ({
        id,
        index,
        expenseName,
        amount,
        type,
        paymentMethod,
        netAmount,
        creditDue,
        comments,
      }) => ({
        id: id,
        date: date,
        expense: {
          expenseName: expenseName,
          amount: amount,
          type: type,
          paymentMethod: paymentMethod,
          netAmount: netAmount,
          comments: comments || "", // Default values
          creditDue: creditDue, // Include creditDue here
        },
      })
    )
  );
};
function SearchInput() {
  {
    // console.log(input);
  }
  const [expenses, setExpenses] = useState({
    expenseName: "",
    amount: "",
    date: "",
    type: "gain",
    paymentMethod: "cash",
    comments: "",
    creditDue: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputClicked, setIsInputClicked] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const suggestionsContainerRef = useRef(null);
  const [newFormatData, setNewFormatData] = useState({});
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/expenses/top-expense-names?topN=100"
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    // Fetch expense data
    axios
      .get(`http://localhost:3000/name/${id}`)
      .then((res) => {
        if (res && res.data) {
          // Convert to new format
          const fetchedData = [res.data]; // Wrapping data in array
          const convertedData = convertToNewFormat(fetchedData);

          setNewFormatData(convertedData);

          // Set state with the fetched expense
          const expense = res.data.expense;

          setExpenses({
            expenseName: expense.expenseName || "",
            amount: expense.amount || "",
            date: res.data.date || "",
            type: expense.type || "gain",
            paymentMethod: expense.paymentMethod || "cash",
            comments: expense.comments || "",
            creditDue: expense.creditDue || 0, // Initialize creditDue
          });
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine netAmount based on type
    const netAmount =
      expenses.type === "loss" ? -expenses.amount : expenses.amount;

    let creditDue = 0;
    if (expenses.paymentMethod === "creditNeedToPaid") {
      creditDue = parseFloat(expenses.amount);
    } else if (expenses.paymentMethod === "creditPaid") {
      creditDue = -parseFloat(expenses.amount);
    }

    // Convert the updated state to old format
    const updatedData = [
      {
        id: id,
        date: expenses.date,
        expense: {
          expenseName: expenses.expenseName,
          amount: expenses.amount,
          type: expenses.type,
          paymentMethod: expenses.paymentMethod,
          netAmount: netAmount,
          comments: expenses.comments,
          creditDue: creditDue,
        },
      },
    ];

    // Update data on the server
    axios
      .put(
        `http://localhost:3000/edit-expense/${id}`,
        convertToOldFormat(convertToNewFormat(updatedData))[0]
      )
      .then((res) => {
        if (res.status === 200) {
          alert("Expense updated successfully!");
          navigate("/"); // Redirect after update
        }
      })
      .catch((err) => {
        console.error("Error updating expense:", err);
        alert("Failed to update expense. Please try again.");
      });
  };

  // Update state and filter suggestions on change
  const handleChange = (e) => {
    const value = e.target.value;
    setExpenses((prevExpenses) => ({
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
    if (expenses.expenseName.length > 0) {
      const nearestMatch = suggestions.find((item) =>
        item.toLowerCase().includes(expenses.expenseName.toLowerCase())
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
        setExpenses((prevExpenses) => ({
          ...prevExpenses,
          expenseName: selectedSuggestion, // Update the input with the selected suggestion
        }));
        setFilteredSuggestions([]); // Clear suggestions after selecting
      }
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(filteredSuggestions.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
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
        <h1>Edit an Expense</h1>
        <form onKeyDown={handleKeyDown1} onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="expenseName">Expense Name:</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                id="expenseName"
                className="form-control"
                value={expenses.expenseName}
                onChange={handleChange} // Trigger handleChange on input change
                onClick={handleClick}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="Search expense name..."
                style={{
                  width: "100%",
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
                      onMouseDown={() => setExpenses(item)}
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
              value={expenses.amount}
              onChange={(e) =>
                setExpenses({ ...expenses, amount: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={expenses.date}
              onChange={(e) =>
                setExpenses({ ...expenses, date: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type">Transaction Type:</label>
            <select
              id="type"
              className="form-select"
              value={expenses.type}
              onChange={(e) =>
                setExpenses({ ...expenses, type: e.target.value })
              }
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
              value={expenses.paymentMethod}
              onChange={(e) =>
                setExpenses({ ...expenses, paymentMethod: e.target.value })
              }
            >
              <option value="cash">Cash</option>
              <option value="creditNeedToPaid">Credit Card Due</option>
              <option value="creditPaid">Credit Card Paid</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              className="form-control"
              placeholder="Enter any comments"
              value={expenses.comments}
              onChange={(e) =>
                setExpenses({ ...expenses, comments: e.target.value })
              }
            ></textarea>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" type="submit">
              Update
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

export default SearchInput;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import SearchInput from "./EditExpense";
import { useDispatch } from "react-redux";
import {
  editExpenseAction,
  getExpensesAction,
} from "./Redux/Expenses/expense.action";

// Helper function to convert to new format
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

// Helper function to convert to old format
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

const EditExpenses = () => {
  const [expenses, setExpenses] = useState({
    expenseName: "",
    amount: "",
    date: "",
    type: "gain",
    paymentMethod: "cash",
    comments: "",
    creditDue: 0,
  });
  const dispatch = useDispatch();
  const [newFormatData, setNewFormatData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [id]: id === "amount" ? parseInt(value, 10) || "" : value,
    }));

    // Update the state for SearchInput as well
    if (id === "expenseName") {
      setExpenses((prevState) => ({
        ...prevState,
        expenseName: value, // Update the expenseName in the expenses state
      }));
    }
  };

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

    dispatch(editExpenseAction(id, updatedData));

    navigate("/");
  };
  const handleKeyDown1 = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };
  const [input, setInput] = useState("");
  {
    console.log(input);
  }

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/expenses/top-expense-names?topN=100"
      );
      const data = await response.json();
      setSuggestions(data); // Store all suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (!expenses.length) {
      dispatch(getExpensesAction());
    }
  }, [dispatch]);
  useEffect(() => {
    fetchSuggestions();
  }, []);
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Edit an Expense</h1>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown1}>
          <div className="mb-2">
            <label htmlFor="expenseName">Expense Name:</label>
            <input
              type="text"
              id="expenseName"
              className="form-control"
              placeholder="Enter Expense Name"
              value={expenses.expenseName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              placeholder="Enter Amount"
              value={expenses.amount}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={expenses.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type">Transaction Type:</label>
            <select
              id="type"
              className="form-select"
              value={expenses.type}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
};

export default EditExpenses;

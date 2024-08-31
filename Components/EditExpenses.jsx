import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

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
    });

    return acc;
  }, {});
};

// Helper function to convert to old format
const convertToOldFormat = (data) => {
  return Object.entries(data).flatMap(([date, expensesArray]) =>
    expensesArray.map(
      ({ id, index, expenseName, amount, type, paymentMethod, netAmount }) => ({
        id: id,
        date: date,
        expense: {
          expenseName: expenseName,
          amount: amount,
          type: type,
          paymentMethod: paymentMethod,
          netAmount: netAmount,
          comments: "", // Default values
          creditDue: 0, // Default values
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
  });
  const [newFormatData, setNewFormatData] = useState({});
  const [oldFormatData, setOldFormatData] = useState([]);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
          netAmount: expenses.amount, // Assuming netAmount is the same as amount
          comments: expenses.comments,
          creditDue: 0, // Default value
        },
      },
    ];

    // Update data on the server
    axios
      .put(
        `http://localhost:3000/name/${id}`,
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

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Edit an Expense</h1>
        <form onSubmit={handleSubmit}>
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

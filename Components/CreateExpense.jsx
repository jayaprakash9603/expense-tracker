// CreateExpense.js
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseFormLogic from "./ExpenseFormLogic";

const CreateExpense = () => {
  const initialState = {
    expenseName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "loss", // Default to loss
    paymentMethod: "cash",
    comments: "",
  };

  const {
    formState,
    setFormState,
    error,
    setError,
    isSalaryDate,
    validateForm,
  } = ExpenseFormLogic(initialState);

  const [finalData, setFinalData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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

  const CREDIT_NEED_TO_PAID = "creditNeedToPaid";
  const CREDIT_PAID = "creditPaid";
  const GAIN = "gain";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const { expenseName, amount, date, type, paymentMethod, comments } =
      formState;
    const netAmount = type === GAIN ? parseFloat(amount) : -parseFloat(amount);

    let creditDue = 0;
    if (paymentMethod === CREDIT_NEED_TO_PAID) {
      creditDue = parseFloat(amount);
    } else if (paymentMethod === CREDIT_PAID) {
      creditDue = -parseFloat(amount);
    }

    const newExpense = {
      expenseName,
      amount: parseFloat(amount),
      type,
      paymentMethod,
      netAmount,
      creditDue,
      comments,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/add-expense`,
        {
          date,
          expense: newExpense,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFinalData(response.data);
      navigate("/");
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data || error.message
      );
      setError("There was an error adding your expense. Please try again.");
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Add an Expense</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="expenseName">Expense Name:</label>
            <input
              type="text"
              id="expenseName"
              className="form-control"
              placeholder="Enter Expense Name"
              value={formState.expenseName}
              onChange={handleChange}
            />
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
        {finalData && (
          <div className="mt-3 alert alert-success">
            <h4>Expense Added Successfully!</h4>
            <pre>{JSON.stringify(finalData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateExpense;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateExpense = () => {
  const [formState, setFormState] = useState({
    expenseName: "",
    amount: "",
    date: "",
    type: "gain",
    paymentMethod: "cash",
    comments: "",
  });
  const [error, setError] = useState(""); // For displaying validation errors
  const [finalData, setFinalData] = useState(null); // For storing the final submitted data
  const navigate = useNavigate();

  const validateForm = () => {
    const { expenseName, amount, date } = formState;
    if (!expenseName.trim() || !amount || !date) {
      return "Please fill in all fields.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const { expenseName, amount, date, type, paymentMethod, comments } =
      formState;
    const netAmount =
      type === "gain" ? parseFloat(amount) : -parseFloat(amount);
    const creditDue =
      paymentMethod === "creditNeedToPaid" ? parseFloat(amount) : 0;

    const newExpense = {
      expenseName,
      amount: parseFloat(amount),
      type,
      paymentMethod,
      netAmount,
      comments,
      creditDue, // Ensure creditDue is a number
    };

    try {
      // Post the new expense to the server
      const response = await axios.post(
        `http://localhost:3000/name`,
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

      // Store the final submitted data in state
      setFinalData(response.data);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      console.error("Error adding expense:", error);
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
              onChange={handleChange}
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

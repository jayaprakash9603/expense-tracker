import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpensesTable from "./ExpensesTable"; // Import the child component
import DetailedExpensesTable from "./DetailedExpensesTable";

const ExpenseTableParent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expenses data in the parent component
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/fetch-expenses");
      setData(response.data); // Pass the data to the child component
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(); // Call API when the component mounts
  }, []);

  return (
    <div>
      {/* Pass the data, loading, and error state as props to the child component */}
      {/*<ExpensesTable data={data} loading={loading} error={error} />*/}
      <DetailedExpensesTable data={data} loading={loading} error={error} />
    </div>
  );
};

export default ExpenseTableParent;

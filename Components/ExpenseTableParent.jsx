import React, { useState, useEffect } from "react";
import axios from "axios";
import DetailedExpensesTable from "./DetailedExpensesTable";
import DailySummary from "./DailySummary";
import ExpensesAudits from "./ExpensesAudits";

const ExpenseTableParent = ({ Url, setUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Log the URL whenever it changes
  useEffect(() => {
    console.log("URL in parent component: " + Url);
    fetchExpenses(); // Call fetch function when the URL changes
  }, [Url]); // Dependency array with Url, so it triggers when Url changes

  const fetchExpenses = async () => {
    setLoading(true);

    // Set the default URL if Url is not provided
    const fetchUrl =
      Url || "http://localhost:3000/daily-summary/monthly?year=2024&month=11";

    try {
      const response = await axios.get(fetchUrl);
      setData(response.data); // Pass the data to the child component
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  return (
    <div>
      {/*<DetailedExpensesTable data={data} loading={loading} error={error} />*/}
      {<DailySummary data={data} loading={loading} error={error} />}
      {/*<ExpensesAudits data={data} loading={loading} error={error} />*/}
    </div>
  );
};

export default ExpenseTableParent;

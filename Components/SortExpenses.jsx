// src/components/SortExpenses.js

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RenderTable from "./RenderTable";

const SortExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [sortedData, setSortedData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/name")
      .then((res) => {
        if (res && res.data) {
          setExpenses(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Function to convert and sort the data by date
    const convertAndSortData = (data) => {
      // Convert data
      const convertedData = data.reduce((acc, item) => {
        const date = item.date;

        if (!acc[date]) {
          acc[date] = [];
        }

        const index = acc[date].length + 1;

        acc[date].push({
          id: item.id,
          index: index,
          expenseName: item.expense.expenseName,
          amount: item.expense.amount,
          type: item.expense.type,
          paymentMethod: item.expense.paymentMethod,
          netAmount: item.expense.netAmount,
        });

        return acc;
      }, {});

      // Sort data by date
      const sortedDates = Object.keys(convertedData).sort(
        (a, b) => new Date(b) - new Date(a)
      );
      const sortedData = sortedDates.reduce((acc, date) => {
        acc[date] = convertedData[date];
        return acc;
      }, {});

      setSortedData(sortedData);
    };

    // Check if expenses have data to convert and sort
    if (expenses.length > 0) {
      convertAndSortData(expenses);
    }
  }, [expenses]);

  return (
    <div>
      <h1 className="display-1 text-bg-dark text-center">Sorted Expenses</h1>
      <div className="container">
        <div className="backButton">
          <Link className="btn btn-primary" to="/">
            Back
          </Link>
        </div>
        <RenderTable inputData={sortedData} />
      </div>
    </div>
  );
};

export default SortExpenses;

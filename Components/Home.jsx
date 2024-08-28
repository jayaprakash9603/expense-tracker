import { useEffect, useState } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import axios from "axios";
import RenderTable from "./RenderTable";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [convertedData, setConvertedData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order

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
    // Function to convert and sort the data
    const convertAndSortData = (data, order) => {
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
      const sortedDates = Object.keys(convertedData).sort((a, b) =>
        order === "asc" ? new Date(a) - new Date(b) : new Date(b) - new Date(a)
      );
      const sortedData = sortedDates.reduce((acc, date) => {
        acc[date] = convertedData[date];
        return acc;
      }, {});

      return sortedData;
    };

    // Check if expenses have data to convert and sort
    if (expenses.length > 0) {
      const sortedData = convertAndSortData(expenses, sortOrder);
      setConvertedData(sortedData);
    }
  }, [expenses, sortOrder]);

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value); // Update sortOrder based on user selection
  };

  return (
    <div>
      <h1 className="display-1 text-bg-dark text-center">Expense Tracker</h1>
      <div className="container">
        <div className="d-flex justify-content-between mb-3">
          <div className="createButton">
            <Link className="btn btn-primary" to="/create">
              <i className="bi bi-plus"></i>
            </Link>
          </div>
          <div>
            <label htmlFor="sortOrder" className="me-2">
              Sort By Date:
            </label>
            <select
              id="sortOrder"
              className="form-select"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <RenderTable inputData={convertedData} />
      </div>
    </div>
  );
};

export default Home;

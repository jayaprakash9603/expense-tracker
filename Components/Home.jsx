import { useEffect, useState } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import axios from "axios";
import FilterComponent from "./FilterComponent"; // Import the FilterComponent
import FilteredTable from "./FilteredTable";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [convertedData, setConvertedData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    axios
      .get("http://localhost:3000/fetch-expenses")
      .then((res) => {
        if (res && res.data) {
          setExpenses(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const convertAndSortData = (data, order) => {
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

    if (expenses.length > 0) {
      const sortedData = convertAndSortData(expenses, sortOrder);
      setConvertedData(sortedData);
      setOriginalData(sortedData);
      setFilteredData(sortedData); // Initialize filteredData with sortedData
    }
  }, [expenses, sortOrder]);
  const creditDueAmount = () => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => {
      return total + (expense.expense ? expense.expense.creditDue || 0 : 0);
    }, 0);
  };
  // Calculate the total salary amount across all dates
  const totalSalaryAmount = () => {
    return Object.keys(filteredData).reduce((total, date) => {
      const data = filteredData[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          // Exclude amount if type is 'gain' and paymentMethod is 'creditNeedToPaid'
          if (
            (expense.type === "gain" || expense.type === "loss") &&
            expense.paymentMethod === "creditNeedToPaid"
          ) {
            return sum;
          }
          return sum + (expense.netAmount || 0);
        }, 0)
      );
    }, 0);
  };
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <h1 className="display-1 text-bg-dark text-center">Expense Tracker</h1>
      <div className="container">
        {/* Add FilterComponent */}
        <div className="d-flex justify-content-between align-items-center mb-3 bg-info-subtle">
          <div
            className="d-flex align-items-center mt-3"
            style={{ width: "50%" }}
          >
            <FilterComponent
              inputData={convertedData}
              setFilteredData={setFilteredData}
            />
          </div>
          <div className="d-flex flex-column align-items-start justify-content-center">
            <select
              id="sortOrder"
              className="form-select w-auto"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="desc">Sort By</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <div className="createButton">
            <Link className="btn btn-primary" to="/create">
              <i className="bi bi-plus"></i>
            </Link>
          </div>
        </div>
        {/*console.log(filteredData)*/}
        {/* Pass filteredData to RenderTable */}
        {/* <MonthFilterTableHelper inputData={filteredData} />*/}
        <div className="mb-4 text-center">
          <h3>
            Total Salary Amount:{" "}
            <span className="fw-bold">{totalSalaryAmount()}</span>
          </h3>
          <h3>
            Credit Due: <span className="fw-bold">{creditDueAmount()}</span>
          </h3>
        </div>

        <FilteredTable filteredData={filteredData} />
        {/*<RenderTable inputData={filteredData} sortOrder={sortOrder} />*/}
      </div>
    </div>
  );
};

export default Home;

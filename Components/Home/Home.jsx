import { useState, useEffect } from "react";
import "../../Styles/Home.css";
import { Link } from "react-router-dom";
import FilterComponent from "../Filter/FilterComponent";
import FilteredTable from "../MuiFilterTable/FilteredTable";
import TotalSalary from "./TotalSalary";
import CreditDue from "./CreditDue";
import { useSelector, useDispatch } from "react-redux";
import { getExpensesAction } from "../Redux/Expenses/expense.action";
import { convertAndSortData } from "./dataHelper";
import Loader from "../Loaders/Loader";

const Home = () => {
  const { expenses, loading, error } = useSelector((state) => state.expense);
  const [convertedData, setConvertedData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!expenses.length) {
      dispatch(getExpensesAction());
    }
  }, [expenses, dispatch]);

  useEffect(() => {
    if (expenses.length > 0) {
      const sortedData = convertAndSortData(expenses, sortOrder);
      setConvertedData(sortedData);
      setFilteredData(sortedData);
    }
  }, [expenses, sortOrder]);

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  if (loading) return <Loader />;
  if (error) return <div>Error loading expenses: {error.message}</div>;

  return (
    <div>
      <h1 className="display-1 text-bg-dark text-center">Expense Tracker</h1>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3 bg-info-subtle">
          <FilterComponent
            inputData={convertedData}
            setFilteredData={setFilteredData}
          />
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
        <div className="d-flex justify-content-between mb-3">
          <Link className="btn btn-primary" to="/create">
            <i className="bi bi-plus"></i>
          </Link>
        </div>
        <div className="mb-4 text-center">
          <TotalSalary filteredData={filteredData} />
          <CreditDue filteredData={filteredData} />
        </div>
        <div>
          <FilteredTable filteredData={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Home;

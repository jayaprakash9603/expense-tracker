import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  format,
  getDay,
  addDays,
} from "date-fns";
import FilteredTable from "./FilteredTable";
import FilterComponent from "./FilterComponent";

const MonthFilterTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [convertedData, setConvertedData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");

  const formatDateToYYYYMMDD = (date) => {
    return format(date, "yyyy-MM-dd");
  };

  const initialFromDate = () => {
    const lastMonthSalaryDate = getLastMonthSalaryDate(new Date());
    return formatDateToYYYYMMDD(lastMonthSalaryDate);
  };

  const getLastMonthSalaryDate = (todayDate) => {
    const firstDayOfCurrentMonth = startOfMonth(todayDate);
    const lastDayOfLastMonth = endOfMonth(subMonths(firstDayOfCurrentMonth, 1));

    // Adjust for weekend if necessary
    const dayOfWeek = getDay(lastDayOfLastMonth);
    if (dayOfWeek === 6) {
      // If it's Saturday, go back to Friday
      return addDays(lastDayOfLastMonth, -1);
    } else if (dayOfWeek === 0) {
      // If it's Sunday, go back to Friday
      return addDays(lastDayOfLastMonth, -2);
    }

    return lastDayOfLastMonth;
  };

  const filterData = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999); // Ensure the end date includes the whole day

    const filtered = expenses.filter(({ date }) => {
      const expenseDate = new Date(date);
      return expenseDate >= start && expenseDate <= end;
    });

    const grouped = filtered.reduce((acc, { date, expense }) => {
      if (!acc[date]) acc[date] = [];
      acc[date].push(expense);
      return acc;
    }, {});

    setGroupedExpenses(grouped);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/name");
        if (res && res.data) {
          setExpenses(res.data);

          // Initialize dates and filter data
          const todayStr = new Date().toISOString().split("T")[0];
          setToDate(todayStr);
          const initialDate = initialFromDate();
          setFromDate(initialDate);
          filterData(); // Filter data on initial load
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
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
          order === "asc"
            ? new Date(a) - new Date(b)
            : new Date(b) - new Date(a)
        );

        const sortedData = sortedDates.reduce((acc, date) => {
          acc[date] = convertedData[date];
          return acc;
        }, {});

        return sortedData;
      };

      const sortedData = convertAndSortData(expenses, sortOrder);
      setConvertedData(sortedData);
      setGroupedExpenses(sortedData); // Initialize groupedExpenses with sortedData
    }
  }, [expenses, sortOrder]);

  useEffect(() => {
    if (fromDate && toDate) {
      filterData(); // Refine filter whenever fromDate or toDate changes
    }
  }, [fromDate, toDate]);

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
  };

  const handleToDateChange = (e) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const totalSalaryAmount = () => {
    return Object.keys(groupedExpenses).reduce((total, date) => {
      const data = groupedExpenses[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
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

  const creditDueAmount = () => {
    return Object.values(groupedExpenses)
      .flat()
      .reduce((total, expense) => {
        return total + (expense.creditDue || 0);
      }, 0);
  };

  return (
    <div className="container mt-4">
      <h1 className="display-4 text-center mb-4">Expense Tracker</h1>
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text">From</span>
            <input
              type="date"
              id="fromDate"
              className="form-control"
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text">To</span>
            <input
              type="date"
              id="toDate"
              className="form-control"
              value={toDate}
              onChange={handleToDateChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3 bg-info-subtle">
          <div
            className="d-flex align-items-center mt-3"
            style={{ width: "50%" }}
          >
            <FilterComponent
              inputData={convertedData}
              setFilteredData={setGroupedExpenses} // Pass the new state setter
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
      </div>
      <div className="row mb-3">
        <div className="col">
          <Link className="btn btn-primary" to="/create">
            <i className="bi bi-plus"></i> Add Expense
          </Link>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col text-center">
          <h3>
            Total Salary Amount:{" "}
            <span className="fw-bold">{totalSalaryAmount()}</span>
          </h3>
          <h3>
            Credit Due: <span className="fw-bold">{creditDueAmount()}</span>
          </h3>
        </div>
      </div>
      <FilteredTable filteredData={groupedExpenses} />
    </div>
  );
};

export default MonthFilterTable;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/MonthFilterTable.css";
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  format,
  getDay,
  addDays,
  isToday,
  isWeekend,
  isEqual,
} from "date-fns";
import FilteredTable from "./FilteredTable";
import FilterComponent from "./FilterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

const MonthFilterTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [convertedAllExpenses, setConvertedAllExpenses] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [convertedData, setConvertedData] = useState({});
  const [sortOrder, setSortOrder] = useState("");
  const [isDateRangeValid, setIsDateRangeValid] = useState(false);

  const formatDateToYYYYMMDD = (date) => {
    return format(date, "yyyy-MM-dd");
  };
  {
    console.log(groupedExpenses);
    console.log(allExpenses);
  }
  const getLastMonthSalaryDate = (todayDate) => {
    const firstDayOfCurrentMonth = startOfMonth(todayDate);
    const lastDayOfLastMonth = endOfMonth(subMonths(firstDayOfCurrentMonth, 1));
    const dayOfWeek = getDay(lastDayOfLastMonth);
    if (dayOfWeek === 6) {
      return addDays(lastDayOfLastMonth, -1);
    } else if (dayOfWeek === 0) {
      return addDays(lastDayOfLastMonth, -2);
    }
    return lastDayOfLastMonth;
  };

  const initialFromDate = () => {
    const lastMonthSalaryDate = getLastMonthSalaryDate(new Date());
    return formatDateToYYYYMMDD(lastMonthSalaryDate);
  };

  const filterData = () => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

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
  const isSalaryDay = () => {
    const today = new Date();
    const lastDayOfMonth = endOfMonth(today);
    const lastDayOfMonthDay = getDay(lastDayOfMonth);

    let salaryDate;

    if (isWeekend(lastDayOfMonthDay)) {
      salaryDate = new Date(lastDayOfMonth);
      salaryDate.setDate(
        salaryDate.getDate() - (lastDayOfMonthDay === 6 ? 1 : 2)
      );
    } else {
      salaryDate = lastDayOfMonth;
    }

    return isToday(salaryDate);
  };
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const initialDate = initialFromDate();
    setFromDate(initialDate);
    setToDate(todayStr);
  }, []);

  useEffect(() => {
    if (toDate) {
      const newFromDate = formatDateToYYYYMMDD(
        getLastMonthSalaryDate(new Date(toDate))
      );
      //const today = new Date();
      // if (isSalaryDay(today)) {
      //   console.log("enter salary date block");
      //   setFromDate(toDate);
      //   setToDate(toDate);
      // }
      setFromDate(newFromDate);
    }
  }, [toDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (1 == 1) {
          const res = await axios.get("http://localhost:3000/fetch-expenses");
          if (res && res.data) {
            setAllExpenses(res.data);
          }
        }
        if (1 == 1) {
          const res = await axios.get(
            "http://localhost:3000/fetch-expenses-by-date",
            {
              params: { from: fromDate, to: toDate },
            }
          );
          if (res && res.data) {
            setExpenses(res.data);
            // console.log("rest" + res[0].data);
            filterData();
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (fromDate && toDate) {
      fetchData();
    }
  }, [fromDate, toDate]);
  const isValidDateRange = (fromDate, toDate, initialFromDate) => {
    const isToDateToday = isToday(new Date(toDate));
    const lastMonthSalaryDate = initialFromDate(); // The function you use to calculate last salary date
    const isFromDateLastSalaryDay = isEqual(
      new Date(fromDate),
      new Date(lastMonthSalaryDate)
    );

    return isToDateToday && isFromDateLastSalaryDay;
  };

  useEffect(() => {
    const checkDateRange = () => {
      const valid = isValidDateRange(fromDate, toDate, initialFromDate);
      setIsDateRangeValid(valid);
    };

    checkDateRange();
  }, [fromDate, toDate]);
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
  const incomeAmount = (groupedExpenses) => {
    return Object.keys(groupedExpenses).reduce((total, date) => {
      const data = groupedExpenses[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          // Check for gain but exclude "creditNeedToPaid" payment method
          if (
            expense.type === "gain" &&
            expense.paymentMethod !== "creditNeedToPaid"
          ) {
            return sum + (expense.amount || 0);
          }
          return sum; // Return the sum unchanged if the condition is not met
        }, 0)
      );
    }, 0);
  };

  const balanceAmount = (groupedExpenses) => {
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
  const creditDueAmount = (groupedExpenses) => {
    return Object.keys(groupedExpenses).reduce((total, date) => {
      const data = groupedExpenses[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          if (expense.paymentMethod === "creditNeedToPaid") {
            return sum + (expense.amount || 0);
          }
          if (expense.paymentMethod === "creditPaid") {
            return sum - (expense.amount || 0);
          }
          return sum;
        }, 0)
      );
    }, 0);
  };
  {
    // console.log(groupedExpenses);
  }
  const expensesAmount = (groupedExpenses) => {
    return Object.keys(groupedExpenses).reduce((total, date) => {
      const data = groupedExpenses[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          // Include conditions
          if (
            (expense.type === "loss" && expense.paymentMethod === "cash") ||
            ((expense.type === "loss" || expense.type === "gain") &&
              expense.paymentMethod === "creditPaid")
          ) {
            return sum + (expense.amount || 0); // Add the expense amount
          }
          // Exclude "creditPaid" or other cases not matching the conditions
          return sum;
        }, 0)
      );
    }, 0);
  };
  const convertDataFormat = (data) => {
    // Initialize an empty object to hold the transformed data
    const formattedData = {};

    data.forEach((entry) => {
      const { date, expense } = entry;

      // If the date is not already a key in formattedData, initialize it with an empty array
      if (!formattedData[date]) {
        formattedData[date] = [];
      }

      // Push the formatted expense object into the array for the corresponding date
      formattedData[date].push({
        id: entry.id,
        index: formattedData[date].length + 1, // Index is the next number in the array
        expenseName: expense.expenseName,
        amount: expense.amount,
        type: expense.type,
        paymentMethod: expense.paymentMethod,
        netAmount: expense.netAmount,
      });
    });

    return formattedData;
  };

  useEffect(() => {
    const data = convertDataFormat(allExpenses);
    setConvertedAllExpenses(data);
  }, [groupedExpenses]);

  return (
    <div className="container mt-4">
      <div className="row mb-4 main-div">
        <h1 className="display-3 text-center mb-4 heading">Expense Tracker</h1>
        <div className="balance-display">
          <FontAwesomeIcon icon={faCalculator} className="calculator-icon" />
          <div className="header-text">
            <h1>YOUR BALANCE</h1>
            <h2
              className={
                balanceAmount(convertedAllExpenses) < 0
                  ? "negative-balance"
                  : "positive-balance"
              }
            >
              ₹ {balanceAmount(convertedAllExpenses)}
            </h2>
          </div>
          <div className="col text-center income-display">
            <div className="income-div">
              <h2 className="income-heading">INCOME</h2>
              <h3 className="fw-bold">
                {isValidDateRange(fromDate, toDate, initialFromDate)
                  ? incomeAmount(groupedExpenses)
                  : incomeAmount(convertedAllExpenses)}
              </h3>
            </div>
            <div className="creditDue-div">
              <h2 className="due-heading">DUE</h2>
              <h3 className="fw-bold">
                ₹
                {isValidDateRange(fromDate, toDate, initialFromDate)
                  ? creditDueAmount(convertedAllExpenses)
                  : creditDueAmount(groupedExpenses)}
              </h3>
            </div>
            <div className="expenses-div">
              <h2 className="expenses-heading">EXPENSES</h2>
              <h3 className="fw-bold">
                ₹
                {expensesAmount(groupedExpenses) +
                  creditDueAmount(groupedExpenses)}
              </h3>
            </div>
          </div>
        </div>
      </div>
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
              <option value="">Sort By</option>
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
      <div>
        <FilteredTable filteredData={groupedExpenses} />
      </div>
    </div>
  );
};

export default MonthFilterTable;

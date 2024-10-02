import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Styles/ExpenseCalendar.css";
import { format, parseISO } from "date-fns";

const ExpenseCalendar = () => {
  const [date, setDate] = useState(new Date()); // Initializing with today's date
  const [expenses, setExpenses] = useState({});
  const [selectedDateExpenses, setSelectedDateExpenses] = useState([]);

  useEffect(() => {
    // Fetch expenses from the server when component mounts
    axios
      .get("http://localhost:3000/fetch-expenses")
      .then((response) => {
        const fetchedExpenses = response.data;
        const groupedByDate = fetchedExpenses.reduce(
          (acc, { date, expense }) => {
            const formattedDate = format(parseISO(date), "yyyy-MM-dd");
            if (!acc[formattedDate]) acc[formattedDate] = [];
            acc[formattedDate].push(expense);
            return acc;
          },
          {}
        );
        setExpenses(groupedByDate);

        // Set expenses for today's date after fetching data
        const todayFormatted = format(new Date(), "yyyy-MM-dd");
        setSelectedDateExpenses(groupedByDate[todayFormatted] || []);
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Convert selected date to YYYY-MM-DD format
    const formattedDate = format(newDate, "yyyy-MM-dd");
    setSelectedDateExpenses(expenses[formattedDate] || []);
  };

  return (
    <div className="calendar-container container mt-4">
      <div className="calendar-section mb-4">
        <Calendar onChange={handleDateChange} value={date} />
      </div>

      <div className="expenses-list">
        <h2 className="mb-3">Expenses on {format(date, "MMMM dd, yyyy")}:</h2>
        {selectedDateExpenses.length === 0 ? (
          <p className="text-muted">No expenses for this date.</p>
        ) : (
          <table className="table table-hover table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Expense Name</th>
                <th>Amount</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {selectedDateExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>
                    <strong>{expense.expenseName}</strong>
                  </td>
                  <td>{expense.amount}</td>
                  <td>{expense.comments || "No comments"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseCalendar;

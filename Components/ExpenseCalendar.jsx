import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../Styles/ExpenseCalendar.css";

const ExpenseCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [expenses, setExpenses] = useState({});
  const [selectedDateExpenses, setSelectedDateExpenses] = useState([]);

  useEffect(() => {
    // Fetch expenses from the server
    axios
      .get("http://localhost:3000/name")
      .then((response) => {
        const fetchedExpenses = response.data;
        const groupedByDate = fetchedExpenses.reduce(
          (acc, { date, expense }) => {
            if (!acc[date]) acc[date] = [];
            acc[date].push(expense);
            return acc;
          },
          {}
        );
        setExpenses(groupedByDate);
      })
      .catch((error) => console.error("Error fetching expenses:", error));
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Convert to YYYY-MM-DD format
    const formattedDate = newDate.toLocaleDateString("en-CA");
    setSelectedDateExpenses(expenses[formattedDate] || []);
  };

  return (
    <div className="calendar-container">
      <h1>Expense Calendar</h1>
      <div className="calendar-section">
        <Calendar onChange={handleDateChange} value={date} />
      </div>
      <div className="expenses-list">
        <h2>Expenses on {date.toDateString()}:</h2>
        {selectedDateExpenses.length === 0 ? (
          <p>No expenses for this date.</p>
        ) : (
          <ul>
            {selectedDateExpenses.map((expense, index) => (
              <li key={index}>
                <strong>{expense.expenseName}</strong> - {expense.amount}
                <p>Comments: {expense.comments}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseCalendar;

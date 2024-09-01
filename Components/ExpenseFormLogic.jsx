// ExpenseFormLogic.js
import { useState, useEffect } from "react";

const ExpenseFormLogic = (initialState) => {
  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState("");
  const [isSalaryDate, setIsSalaryDate] = useState(false);

  useEffect(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    let salaryDate = lastDayOfMonth;

    if (salaryDate.getDay() === 6) {
      // If it's Saturday, adjust to Friday
      salaryDate.setDate(salaryDate.getDate() - 1);
    } else if (salaryDate.getDay() === 0) {
      // If it's Sunday, adjust to Friday
      salaryDate.setDate(salaryDate.getDate() - 2);
    }

    const isSalary = today.toDateString() === salaryDate.toDateString();
    setIsSalaryDate(isSalary);

    setFormState((prevState) => ({
      ...prevState,
      date: today.toISOString().split("T")[0], // Default to today's date
      type: isSalary ? "gain" : prevState.type,
    }));
  }, []);

  const validateForm = () => {
    const { expenseName, amount, date } = formState;
    if (!expenseName.trim() || !amount || !date) {
      return "Please fill in all fields.";
    }
    return "";
  };

  return {
    formState,
    setFormState,
    error,
    setError,
    isSalaryDate,
    validateForm,
  };
};

export default ExpenseFormLogic;

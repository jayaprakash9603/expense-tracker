import React, { useState, useEffect } from "react";

// Function to get the last weekday of the previous month
const getLastMonthSalaryDate = (todayDate) => {
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();
  const lastDayPrevMonth = new Date(year, month, 0); // Last day of the previous month

  // Adjust for weekend if necessary
  const dayOfWeek = lastDayPrevMonth.getDay();
  if (dayOfWeek === 6) {
    // Saturday
    lastDayPrevMonth.setDate(lastDayPrevMonth.getDate() - 1); // Friday
  } else if (dayOfWeek === 0) {
    // Sunday
    lastDayPrevMonth.setDate(lastDayPrevMonth.getDate() - 2); // Friday
  }

  return lastDayPrevMonth;
};

const DateUtils = ({ toDate, onFromDateChange }) => {
  useEffect(() => {
    if (toDate) {
      const todayDate = new Date(toDate);
      const lastMonthSalaryDate = getLastMonthSalaryDate(todayDate);
      onFromDateChange(lastMonthSalaryDate.toISOString().split("T")[0]);
    }
  }, [toDate, onFromDateChange]);

  return null;
};

export default DateUtils;

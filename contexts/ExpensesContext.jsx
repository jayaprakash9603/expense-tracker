// ExpensesContext.js
import React, { createContext, useState } from "react";

// Create the context
export const ExpensesContext = createContext();

// Create a provider component
export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  return (
    <ExpensesContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};

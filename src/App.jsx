import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import CreateExpense from "../Components/CreateExpense";
import "bootstrap-icons/font/bootstrap-icons.css";
import SortExpenses from "../Components/SortExpenses";

import FilteredTable from "../Components/FilteredTable";
import EditExpenses from "../Components/EditExpenses";
import ExpenseCalendar from "../Components/ExpenseCalendar";
import ReadExpenses from "../Components/ReadExpenses";
import MonthlyBudget from "../Components/MonthlyBudget";
import MonthFilterTable from "../Components/MonthFilterTable";
import { PieChart } from "recharts";
import BudgetPieChart from "../Components/BudgetPieChart";
import InvestmentCalculator from "../Components/InvestmentCalculator";
import { ExpensesProvider } from "../Contexts/ExpensesContext"; // Adjust the path based on your folder structure

const App = () => {
  return (
    <ExpensesProvider>
      {" "}
      {/* Wrap with ExpensesProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/monthfilter" element={<Home />} />
          <Route path="/" element={<MonthFilterTable />} />
          <Route path="/create" element={<CreateExpense />} />
          <Route path="/sort" element={<SortExpenses />} />
          <Route path="/edit/:id" element={<EditExpenses />} />
          <Route path="/filter/filteredData" element={<FilteredTable />} />
          <Route path="/calendar" element={<ExpenseCalendar />} />
          <Route path="/read/:id" element={<ReadExpenses />} />
          <Route path="/budget" element={<MonthlyBudget />} />
          <Route path="/data" element={<MonthFilterTable />} />
          <Route path="/investment" element={<InvestmentCalculator />} />
        </Routes>
      </BrowserRouter>
    </ExpensesProvider>
  );
};

export default App;

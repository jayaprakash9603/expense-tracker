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
import SearchInput from "../Components/EditExpense";
import ExpenseForm from "../Components/ExpenseFormLogic";
import ExpenseFormLogic from "../Components/ExpenseFormLogic";
import CreateExpenses from "../Components/CreateExpenses";
import EditExpense from "../Components/EditExpense";
import AuditLogsEmailSender from "../Components/AuditLogsEmailSender";
import AuditLogsEmailSender1 from "../Components/AuditLogsEmailSender1";
import ExpenseSummaryEmailSender from "../Components/ExpenseSummaryEmailSender";
import ExpensesEmail from "../Components/ExpensesEmail";
import ReportsGeneration from "../Components/ReportsGeneration";
import ExpensesTable from "../Components/ExpensesTable";
import ExpenseTableParent from "../Components/ExpenseTableParent";

const App = () => {
  return (
    <ExpensesProvider>
      {" "}
      {/* Wrap with ExpensesProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monthfilter" element={<MonthFilterTable />} />
          <Route path="/create" element={<CreateExpenses />} />
          <Route path="/sort" element={<SortExpenses />} />
          <Route path="/edit/:id" element={<EditExpense />} />
          <Route path="/filter/filteredData" element={<FilteredTable />} />
          <Route path="/calendar" element={<ExpenseCalendar />} />
          <Route path="/read/:id" element={<ReadExpenses />} />
          <Route path="/budget" element={<MonthlyBudget />} />
          <Route path="/data" element={<MonthFilterTable />} />
          <Route path="/investment" element={<InvestmentCalculator />} />
          <Route path="/email" element={<AuditLogsEmailSender />} />
          <Route path="/email1" element={<AuditLogsEmailSender1 />} />
          <Route path="/expense" element={<ExpensesEmail />} />
          <Route path="/reports" element={<ReportsGeneration />} />
          <Route path="/expense1" element={<ExpenseSummaryEmailSender />} />
          <Route path="/search1" element={<ExpenseTableParent />} />
        </Routes>
      </BrowserRouter>
    </ExpensesProvider>
  );
};

export default App;

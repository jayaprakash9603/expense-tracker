import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import CreateExpense from "../Components/CreateExpense";
import "bootstrap-icons/font/bootstrap-icons.css";
import SortExpenses from "../Components/SortExpenses";

import FilteredTable from "../Components/FilteredTable";
import EditExpenses from "../Components/EditExpenses";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateExpense />} />
          <Route path="/sort" element={<SortExpenses />} />
          <Route path="/edit/:id" element={<EditExpenses />} />
          <Route path="/filter/filteredData" element={<FilteredTable />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

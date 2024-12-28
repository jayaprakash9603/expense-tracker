import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  TableBody,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSortedData } from "./useSortedData";
import TableHeader from "./TableHeader";
import TableBodyComponent from "./TableBodyComponent";
import TotalRow from "./TotalRow";
import { formatDate } from "../FilterTable/dateUtils";
import { getExpenses, deleteExpense } from "./apiService";
import "./FilteredTable.css";
import { useDispatch } from "react-redux";
import {
  deleteExpenseAction,
  getExpensesAction,
} from "../Redux/Expenses/expense.action";
const FilteredTable = ({ filteredData }) => {
  const [data, setData] = useState(filteredData);
  const { sortedData, handleSort, sortConfig } = useSortedData(filteredData);
  const dispatch = useDispatch();
  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const methodMapping = {
    cash: "Cash",
    creditNeedToPaid: "Credit Card Due",
    creditPaid: "Credit Paid",
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Would you like to delete?");
    if (confirm) {
      try {
        // await deleteExpense(id);
        dispatch(deleteExpenseAction(id));
        const response = await getExpenses();
        console.log(response);
        dispatch(getExpensesAction());
        setData(response);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  return (
    <Container>
      {Object.keys(filteredData).length > 0 ? (
        Object.keys(filteredData).map((date) => (
          <div key={date} className="mb-4">
            <h3 className="text-center">{formatDate(date)}</h3>
            <TableContainer component={Paper} className="container">
              <Table className="table-info table">
                <TableHeader
                  date={date}
                  handleSort={handleSort}
                  sortConfig={sortConfig}
                />
                <TableBodyComponent
                  data={sortedData(date)}
                  methodMapping={methodMapping}
                  handleDelete={handleDelete}
                />
                <TotalRow data={sortedData(date)} />
              </Table>
            </TableContainer>
          </div>
        ))
      ) : (
        <div className="alert alert-info text-center">No data found.</div>
      )}
    </Container>
  );
};

export default FilteredTable;

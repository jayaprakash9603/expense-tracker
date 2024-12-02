import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadTable = ({ expenses, setExpenses }) => {
  //   const [expenses, setExpenses] = useState([]);
  const [checkedExpenses, setCheckedExpenses] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const onFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setMessage("Please select a file to upload.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/expenses/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setExpenses(response.data);
      setMessage("File uploaded and data saved successfully.");
      setAlertSeverity("success");
      setAlertOpen(true);
      fileInputRef.current.value = ""; // Clear the file input
      setFileName(""); // Clear the file name
    } catch (error) {
      setMessage(
        "Failed to upload file: " +
          (error.response?.data?.message || error.message)
      );
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newChecked = expenses.map((n) => n.id);
      setCheckedExpenses(newChecked);
      return;
    }
    setCheckedExpenses([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = checkedExpenses.indexOf(id);
    let newChecked = [];

    if (selectedIndex === -1) {
      newChecked = newChecked.concat(checkedExpenses, id);
    } else if (selectedIndex === 0) {
      newChecked = newChecked.concat(checkedExpenses.slice(1));
    } else if (selectedIndex === checkedExpenses.length - 1) {
      newChecked = newChecked.concat(checkedExpenses.slice(0, -1));
    } else if (selectedIndex > 0) {
      newChecked = newChecked.concat(
        checkedExpenses.slice(0, selectedIndex),
        checkedExpenses.slice(selectedIndex + 1)
      );
    }

    setCheckedExpenses(newChecked);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id, field, value) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              expense: {
                ...expense.expense,
                [field]: value,
              },
            }
          : expense
      )
    );
  };

  const sortedExpenses = expenses.sort((a, b) => {
    if (orderBy === "date") {
      return order === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return order === "asc"
        ? a[orderBy] < b[orderBy]
          ? -1
          : 1
        : a[orderBy] > b[orderBy]
        ? -1
        : 1;
    }
  });

  const paginatedExpenses = sortedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg">
      {expenses.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 5, width: "100vw" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      checkedExpenses.length > 0 &&
                      checkedExpenses.length < expenses.length
                    }
                    checked={
                      expenses.length > 0 &&
                      checkedExpenses.length === expenses.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "date"}
                    direction={orderBy === "date" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "date")}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "expenseName"}
                    direction={orderBy === "expenseName" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "expenseName")}
                  >
                    Expense Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Net Amount</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Credit Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExpenses.map((expense) => {
                const isItemSelected =
                  checkedExpenses.indexOf(expense.id) !== -1;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={expense.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, expense.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.date}
                        onChange={(e) =>
                          handleEdit(expense.id, "date", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.expenseName}
                        onChange={(e) =>
                          handleEdit(expense.id, "expenseName", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.amount}
                        onChange={(e) =>
                          handleEdit(expense.id, "amount", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.type}
                        onChange={(e) =>
                          handleEdit(expense.id, "type", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.paymentMethod}
                        onChange={(e) =>
                          handleEdit(
                            expense.id,
                            "paymentMethod",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.netAmount}
                        onChange={(e) =>
                          handleEdit(expense.id, "netAmount", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.comments}
                        onChange={(e) =>
                          handleEdit(expense.id, "comments", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={expense.expense.creditDue}
                        onChange={(e) =>
                          handleEdit(expense.id, "creditDue", e.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default UploadTable;

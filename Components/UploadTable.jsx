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
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadTable = ({ expenses, setExpenses }) => {
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
  const [filters, setFilters] = useState({
    date: "",
    expenseName: "",
    amount: "",
    type: "",
    paymentMethod: "",
    comments: "",
    creditDue: "",
  });
  const fileInputRef = useRef(null);

  const filterConfig = [
    { label: "Date", name: "date", width: 1.5 },
    { label: "Expense Name", name: "expenseName", width: 2 },
    { label: "Amount", name: "amount", width: 1 },
    { label: "Type", name: "type", width: 1 },
    { label: "Payment Method", name: "paymentMethod", width: 1.5 },
    { label: "Comments", name: "comments", width: 2 },
    { label: "Credit Due", name: "creditDue", width: 1 },
  ];

  const tableHeaders = [
    { label: "Date", name: "date", width: 150 },
    { label: "Expense Name", name: "expenseName", width: 200 },
    { label: "Amount", name: "amount", width: 100 },
    { label: "Type", name: "type", width: 100 },
    { label: "Payment Method", name: "paymentMethod", width: 150 },
    { label: "Net Amount", name: "netAmount", width: 100 },
    { label: "Comments", name: "comments", width: 200 },
    { label: "Credit Due", name: "creditDue", width: 100 },
  ];

  const tableCells = [
    { key: "date", width: 150 },
    { key: "expense.expenseName", width: 200 },
    { key: "expense.amount", width: 100 },
    { key: "expense.type", width: 100 },
    { key: "expense.paymentMethod", width: 150 },
    { key: "expense.netAmount", width: 100 },
    { key: "expense.comments", width: 200 },
    { key: "expense.creditDue", width: 100 },
  ];

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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = (expenses) => {
    return expenses.filter((expense) => {
      return (
        expense.date.includes(filters.date) &&
        expense.expense.expenseName
          .toLowerCase()
          .includes(filters.expenseName.toLowerCase()) &&
        expense.expense.amount.toString().includes(filters.amount) &&
        expense.expense.type
          .toLowerCase()
          .includes(filters.type.toLowerCase()) &&
        expense.expense.paymentMethod
          .toLowerCase()
          .includes(filters.paymentMethod.toLowerCase()) &&
        expense.expense.comments
          .toLowerCase()
          .includes(filters.comments.toLowerCase()) &&
        expense.expense.creditDue.toString().includes(filters.creditDue)
      );
    });
  };

  const filteredExpenses = applyFilters(expenses);

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    const aValue = orderBy.split(".").reduce((o, i) => o[i], a);
    const bValue = orderBy.split(".").reduce((o, i) => o[i], b);
    if (orderBy === "date") {
      return order === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    } else {
      return order === "asc"
        ? aValue < bValue
          ? -1
          : 1
        : aValue > bValue
        ? -1
        : 1;
    }
  });

  const paginatedExpenses = sortedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getCheckedExpensesData = () => {
    return checkedExpenses.map((id) => {
      const expense = expenses.find((expense) => expense.id === id);
      return {
        id: expense.id,
        date: expense.date,
        expense: {
          id: expense.id,
          expenseName: expense.expense.expenseName,
          amount: expense.expense.amount,
          type: expense.expense.type,
          paymentMethod: expense.expense.paymentMethod,
          netAmount: expense.expense.netAmount,
          comments: expense.expense.comments,
          creditDue: expense.expense.creditDue,
        },
      };
    });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} mb={2}>
        {filterConfig.map((filter) => (
          <Grid item xs={filter.width} key={filter.name}>
            <TextField
              label={filter.label}
              variant="outlined"
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
      {expenses.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 5, width: "90vw" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 50 }}>
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
                {tableHeaders.map((header) => (
                  <TableCell key={header.name} sx={{ width: header.width }}>
                    <TableSortLabel
                      active={orderBy === header.name}
                      direction={orderBy === header.name ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, header.name)}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
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
                    sx={{ height: 60 }} // Set fixed row height
                  >
                    <TableCell padding="checkbox" sx={{ width: 50 }}>
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, expense.id)}
                      />
                    </TableCell>
                    {tableCells.map((cell) => (
                      <TableCell key={cell.key} sx={{ width: cell.width }}>
                        {cell.key.split(".").reduce((o, i) => o[i], expense)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => console.log(getCheckedExpensesData())}
        sx={{ mt: 2 }}
      >
        Get Checked Expenses Data
      </Button>
    </Container>
  );
};

export default UploadTable;

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
import "../Styles/UploadTable.css"; // Import the CSS file

const UploadTable = ({ expenses, setExpenses }) => {
  const [checkedExpenses, setCheckedExpenses] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    expenseName: "",
  });
  const fileInputRef = useRef(null);

  const tableHeaders = [
    { label: "Date", name: "date", width: 150 },
    { label: "Expense Name", name: "expense.expenseName", width: 200 },
    { label: "Amount", name: "expense.amount", width: 100 },
    { label: "Type", name: "expense.type", width: 100 },
    { label: "Payment Method", name: "expense.paymentMethod", width: 150 },
    { label: "Net Amount", name: "expense.netAmount", width: 120 },
    { label: "Comments", name: "expense.comments", width: 200 },
    { label: "Credit Due", name: "expense.creditDue", width: 100 },
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
      return expense.expense.expenseName
        .toLowerCase()
        .includes(filters.expenseName.toLowerCase());
    });
  };

  const filteredExpenses = applyFilters(expenses);

  const sortedExpenses = filteredExpenses.sort((a, b) => {
    const getNestedValue = (obj, path) => {
      return path.split(".").reduce((o, i) => (o ? o[i] : null), obj);
    };

    const aValue = getNestedValue(a, orderBy);
    const bValue = getNestedValue(b, orderBy);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (!isNaN(new Date(aValue)) && !isNaN(new Date(bValue))) {
      return order === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    } else {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  const paginatedExpenses = sortedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getCheckedExpensesData = () => {
    const filteredExpenses = applyFilters(expenses);
    return checkedExpenses
      .map((id) => {
        const expense = filteredExpenses.find((expense) => expense.id === id);
        if (expense) {
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
        }
        return undefined;
      })
      .filter((expense) => expense !== undefined);
  };

  const handleDeleteAndFetch = async () => {
    const checkedExpensesData = getCheckedExpensesData();
    const deleteIds = checkedExpensesData.map((expense) => expense.id);

    try {
      const response = await axios.post(
        "http://localhost:3000/expenses/delete-and-send",
        {
          expenses,
          deleteid: deleteIds,
        }
      );
      console.log("deleted data---", response);
      setExpenses(response.data);
      setCheckedExpenses([]);
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  return (
    <Container className="upload-main-container">
      <Grid container spacing={0} mb={2} className="upload-table-container">
        <Grid item xs={4}>
          <TextField
            label="Expense Name"
            variant="outlined"
            name="expenseName"
            value={filters.expenseName}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
      </Grid>
      {expenses.length > 0 ? (
        <TableContainer
          component={Paper}
          className="custom-scrollbar " // Apply the custom scrollbar class
          sx={{
            mt: 5,
            width: "80vw",
            margin: "0 auto",
            maxHeight: "50vh", // Optional: Scrollable container
          }}
        >
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              tableLayout: "fixed", // Ensures columns have a fixed width
            }}
          >
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
                  <TableCell
                    key={header.name}
                    sx={{
                      width: header.width,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
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
                    sx={{ height: 60 }} // Fixed row height
                  >
                    <TableCell padding="checkbox" sx={{ width: 50 }}>
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, expense.id)}
                      />
                    </TableCell>
                    {tableCells.map((cell) => (
                      <TableCell
                        key={cell.key}
                        sx={{
                          width: cell.width, // Fixed column width
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cell.key.split(".").reduce((o, i) => o[i], expense)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 5 }}>
          No data available to display.
        </Typography>
      )}
      {expenses.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={filteredExpenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
      <Button
        variant="contained"
        color="danger"
        onClick={handleDeleteAndFetch}
        sx={{ mt: 2 }}
      >
        Delete
      </Button>
    </Container>
  );
};

export default UploadTable;

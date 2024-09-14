const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { format } = require("date-fns"); // Import format from date-fns

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "sys",
  port: 5000, // Default MySQL port
});

app.use(cors());
app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/add-expense", (req, res) => {
  const { date, expense } = req.body;
  const {
    expenseName,
    amount,
    type,
    paymentMethod,
    netAmount,
    comments,
    creditDue,
  } = expense;

  // Generate a new UUID for the expense ID
  const expenseId = uuidv4(); // Use UUID or any method to generate a unique ID

  const insertExpenseQuery = "INSERT INTO expenses (id, date) VALUES (?, ?)";
  const insertExpenseValues = [expenseId, date];

  const insertExpenseDetailsQuery = `
    INSERT INTO expense_details (id, expenseName, amount, type, paymentMethod, netAmount, comments, creditDue)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const insertExpenseDetailsValues = [
    expenseId,
    expenseName,
    amount,
    type,
    paymentMethod,
    netAmount,
    comments,
    creditDue,
  ];

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).send("Transaction error: " + err);
    }

    connection.query(insertExpenseQuery, insertExpenseValues, (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send("Error inserting into expenses: " + err);
        });
      }

      connection.query(
        insertExpenseDetailsQuery,
        insertExpenseDetailsValues,
        (err) => {
          if (err) {
            return connection.rollback(() => {
              res
                .status(500)
                .send("Error inserting into expense_details: " + err);
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send("Transaction commit error: " + err);
              });
            }
            res.status(200).send("Expense added successfully");
          });
        }
      );
    });
  });
});

// Route to fetch expense by ID
app.get("/name/:id", (req, res) => {
  const expenseId = req.params.id;

  const query = `
    SELECT e.id, e.date, d.expenseName, d.amount, d.type, d.paymentMethod, d.netAmount, d.comments, d.creditDue
    FROM expenses e
    JOIN expense_details d ON e.id = d.id
    WHERE e.id = ?
  `;

  connection.query(query, [expenseId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send("Database query failed.");
    }

    if (results.length === 0) {
      return res.status(404).send("Expense not found.");
    }

    // Assuming only one result should be returned
    const result = results[0];

    // Transform the result into the desired format
    const formattedResult = {
      id: result.id,
      date: format(new Date(result.date), "yyyy-MM-dd"), // Format date to YYYY-MM-DD
      expense: {
        expenseName: result.expenseName,
        amount: parseFloat(result.amount),
        type: result.type,
        paymentMethod: result.paymentMethod,
        netAmount: parseFloat(result.netAmount),
        comments: result.comments,
        creditDue: parseFloat(result.creditDue),
      },
    };

    res.json(formattedResult);
  });
});

app.put("/edit-expense/:id", (req, res) => {
  const expenseId = req.params.id;
  const { date, expense } = req.body;
  const {
    expenseName,
    amount,
    type,
    paymentMethod,
    netAmount,
    comments,
    creditDue,
  } = expense;

  const updateExpenseQuery = "UPDATE expenses SET date = ? WHERE id = ?";
  const updateExpenseValues = [date, expenseId];

  const updateExpenseDetailsQuery = `
    UPDATE expense_details SET
      expenseName = ?,
      amount = ?,
      type = ?,
      paymentMethod = ?,
      netAmount = ?,
      comments = ?,
      creditDue = ?
    WHERE id = ?
  `;
  const updateExpenseDetailsValues = [
    expenseName,
    amount,
    type,
    paymentMethod,
    netAmount,
    comments,
    creditDue,
    expenseId,
  ];

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).send("Transaction error: " + err);
    }

    connection.query(updateExpenseQuery, updateExpenseValues, (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send("Error updating expenses: " + err);
        });
      }

      connection.query(
        updateExpenseDetailsQuery,
        updateExpenseDetailsValues,
        (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send("Error updating expense_details: " + err);
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).send("Transaction commit error: " + err);
              });
            }
            res.status(200).send("Expense updated successfully");
          });
        }
      );
    });
  });
});

// Route to fetch expenses by date range
app.get("/fetch-expenses-by-date", (req, res) => {
  const { from, to } = req.query;
  console.log(from + "" + to);
  if (!from || !to) {
    return res
      .status(400)
      .send("Both 'from' and 'to' date parameters are required.");
  }

  const query = `
      SELECT e.id, e.date, d.expenseName, d.amount, d.type, d.paymentMethod, d.netAmount, d.comments, d.creditDue
      FROM expenses e
      JOIN expense_details d ON e.id = d.id
      WHERE e.date BETWEEN ? AND ?
    `;

  connection.query(query, [from, to], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send("Database query failed.");
    }

    const formattedResults = results.map((row) => ({
      id: row.id,
      date: format(new Date(row.date), "yyyy-MM-dd"),
      expense: {
        expenseName: row.expenseName,
        amount: parseFloat(row.amount),
        type: row.type,
        paymentMethod: row.paymentMethod,
        netAmount: parseFloat(row.netAmount),
        comments: row.comments,
        creditDue: parseFloat(row.creditDue),
      },
    }));

    res.json(formattedResults);
  });
});

app.get("/fetch-expenses", (req, res) => {
  const query = `
    SELECT e.id, e.date, d.expenseName, d.amount, d.type, d.paymentMethod, d.netAmount, d.comments, d.creditDue
    FROM expenses e
    JOIN expense_details d ON e.id = d.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send("Database query failed.");
    }

    // Transform the results into the desired format using date-fns
    const formattedResults = results.map((row) => ({
      id: row.id,
      date: format(new Date(row.date), "yyyy-MM-dd"), // Format date to YYYY-MM-DD
      expense: {
        expenseName: row.expenseName,
        amount: parseFloat(row.amount),
        type: row.type,
        paymentMethod: row.paymentMethod,
        netAmount: parseFloat(row.netAmount),
        comments: row.comments,
        creditDue: parseFloat(row.creditDue),
      },
    }));

    res.json(formattedResults);
  });
});

app.delete("/name/:id", (req, res) => {
  const expenseId = req.params.id;

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).send("Transaction error: " + err);
    }

    const deleteExpenseDetailsQuery =
      "DELETE FROM expense_details WHERE id = ?";
    connection.query(deleteExpenseDetailsQuery, [expenseId], (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send("Error deleting from expense_details: " + err);
        });
      }

      const deleteExpenseQuery = "DELETE FROM expenses WHERE id = ?";
      connection.query(deleteExpenseQuery, [expenseId], (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send("Error deleting from expenses: " + err);
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send("Transaction commit error: " + err);
            });
          }
          res.status(200).send("Expense deleted successfully");
        });
      });
    });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

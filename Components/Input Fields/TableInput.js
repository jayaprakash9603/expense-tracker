let expensesData = [];
let summaryData = [];
let auditsData = [];
let loading = true;
let error = null;

async function fetchData() {
  try {
    console.log("Fetching data from /fetch-expenses...");
    const response = await fetch(
      "http://localhost:3000/daily-summary/yearly?year=2024"
    );
    if (!response.ok) {
      console.error(`Fetch failed with status: ${response.status}`);
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    if (!data.length) {
      console.warn("No expenses found in the response.");
      return { expensesData: [], error: null };
    }

    console.log("Fetched data:", data);
    return { expensesData: data, error: null };
  } catch (err) {
    console.error("Error fetching data:", err.message);
    return { expensesData: [], error: "Failed to fetch data" };
  }
}

export { fetchData, expensesData, summaryData, auditsData, loading, error };

// TableInput.js

export const columns = [
  {
    Header: "Date",
    accessor: "date",
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Amount",
    accessor: "totalAmount",
    Cell: ({ value }) => value.toFixed(2),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Loss",
    accessor: "categoryBreakdown.loss",
    Cell: ({ value }) => (value ? value.toFixed(2) : "0.00"),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Gain",
    accessor: "categoryBreakdown.gain",
    Cell: ({ value }) => (value ? value.toFixed(2) : "0.00"),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Remaining",
    accessor: "balanceRemaining",
    Cell: ({ value }) => value.toFixed(2),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Due",
    accessor: "creditDue",
    Cell: ({ value }) => value.toFixed(2),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
  {
    Header: "Credit Paid",
    accessor: "creditPaid",
    Cell: ({ value }) => value.toFixed(2),
    // Filter: DefaultColumnFilter,
    sortType: "basic",
  },
];

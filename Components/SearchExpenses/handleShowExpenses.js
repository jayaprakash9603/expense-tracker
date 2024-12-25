// utils/handleShowExpenses.js
const handleShowExpenses = (
  searchTerm,
  specificYear,
  specificMonth,
  fromDay,
  toDay,
  expenseName,
  paymentMethod,
  category,
  startYear,
  startMonth,
  minAmount,
  maxAmount,
  logTypes,
  setUrl,
  setError
) => {
  let url = "";
  let params = {};

  switch (searchTerm) {
    case "Today":
      url = "http://localhost:3000/expenses/today";
      break;
    case "Yesterday":
      url = "http://localhost:3000/expenses/yesterday";
      break;
    case "Last Week":
      url = "http://localhost:3000/expenses/last-week";
      break;
    case "Current Week":
      url = "http://localhost:3000/expenses/current-week";
      break;
    case "Current Month":
      url = "http://localhost:3000/expenses/current-month";
      break;
    case "Last Month":
      url = "http://localhost:3000/expenses/last-month";
      break;
    case "All Expenses":
      url = "http://localhost:3000/fetch-expenses";
      break;
    case "Monthly Summary":
      if (!specificYear || !specificMonth) {
        setError("Please provide both year and month for the Monthly Summary.");
        return;
      }
      url = `http://localhost:3000/monthly-summary/${specificYear}/${specificMonth}`;
      break;
    case "Within Range Expenses":
      if (!fromDay || !toDay) {
        setError("Please provide both From and To dates");
        return;
      }
      url = "http://localhost:3000/fetch-expenses-by-date";
      params.from = fromDay;
      params.to = toDay;
      break;
    case "Expenses By Name":
      if (!expenseName) {
        setError("Please provide an expense name");
        return;
      }
      url = "http://localhost:3000/expenses/search";
      params.expenseName = expenseName;
      break;
    case "Expenses By Payment Method":
      if (!paymentMethod) {
        setError("Please provide a payment method.");
        return;
      }
      url = `http://localhost:3000/payment-method/${paymentMethod}`;
      break;
    case "Expenses By Type and Payment Method":
      if (!category || !paymentMethod) {
        setError("Please provide type and payment");
        return;
      }
      url = `http://localhost:3000/expenses/${category}/${paymentMethod}`;
      break;
    case "Expenses By Type":
      if (!category) {
        setError("Please provide a category");
        return;
      }
      url = `http://localhost:3000/expenses/${category}`;
      break;
    case "Particular Month Expenses":
      if (!startMonth || !startYear) {
        setError("Please provide month and year");
        return;
      }
      url = `http://localhost:3000/expenses/by-month`;
      params.month = startMonth;
      params.year = startYear;
      break;
    case "Expenses Within Amount Range":
      if (!minAmount || !maxAmount) {
        setError("Please provide min or max value.");
        return;
      }
      url = `http://localhost:3000/expenses/amount-range`;
      params.minAmount = minAmount;
      params.maxAmount = maxAmount;
      break;
    case "Particular Date Expenses":
      if (!fromDay) {
        setError("Please provide a date");
        return;
      }
      url = `http://localhost:3000/expenses/particular-date`;
      params.date = fromDay;
      break;
    default:
      setError("Please select a valid option.");
      return;
  }

  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams(params).toString();
    url = `${url}?${queryParams}`;
  }

  console.log("Sending request to:", url, "with params:", params);
  setUrl(url);
};

export default handleShowExpenses;

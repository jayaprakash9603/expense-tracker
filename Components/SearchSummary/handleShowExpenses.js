const handleShowExpenses = ({
  searchTerm,
  specificYear,
  specificMonth,
  specificDay,
  startYear,
  endYear,
  startMonth,
  endMonth,
  setUrl,
  setError,
}) => {
  setError("");

  let url = "";
  let params = {};

  switch (searchTerm) {
    case "Monthly Wise Daily Expense Summary":
      if (!specificYear || !specificMonth) {
        setError("Please provide both year and month.");
        return;
      }
      url = "http://localhost:3000/daily-summary/monthly";
      params.year = specificYear;
      params.month = specificMonth;
      break;
    case "Summary Between Dates":
      if (!startMonth || !startYear || !endMonth || !endYear) {
        setError("Please provide start and end month and year.");
        return;
      }
      url = `http://localhost:3000/between-dates`;
      params.startMonth = startMonth;
      params.startYear = startYear;
      params.endMonth = endMonth;
      params.endYear = endYear;
      break;
    case "Yearly Wise Daily Expense Summary":
      const parsedYear = parseInt(specificYear, 10);
      if (isNaN(parsedYear)) {
        setError("Year must be an integer.");
        return;
      }
      url = `http://localhost:3000/daily-summary/yearly`;
      params.year = parsedYear;
      break;
    case "Expense Summary for Specific Date":
      const parsedDate = specificDay;
      if (!parsedDate) {
        setError("Date must be provided.");
        return;
      }
      url = `http://localhost:3000/daily-summary/date`;
      params.date = specificDay;
      break;
    default:
      setError("Please select a valid option.");
      return;
  }

  // Append params to the URL if any
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams(params).toString();
    url = `${url}?${queryParams}`;
  }

  console.log("Sending request to:", url, "with params:", params);
  setUrl(url);
};

export default handleShowExpenses;

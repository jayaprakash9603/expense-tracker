export const convertAndSortData = (data, order) => {
  const convertedData = data.reduce((acc, item) => {
    if (!item.expense) {
      console.warn("Missing expense for item:", item);
      return acc;
    }

    const date = item.date;

    if (!acc[date]) {
      acc[date] = [];
    }

    const index = acc[date].length + 1;

    acc[date].push({
      id: item.id,
      index: index,
      expenseName: item.expense.expenseName || "Unnamed Expense",
      amount: item.expense.amount || 0,
      type: item.expense.type || "Unknown",
      paymentMethod: item.expense.paymentMethod || "Unknown",
      netAmount: item.expense.netAmount || 0,
    });

    return acc;
  }, {});

  const sortedDates = Object.keys(convertedData).sort((a, b) =>
    order === "asc" ? new Date(a) - new Date(b) : new Date(b) - new Date(a)
  );

  return sortedDates.reduce((acc, date) => {
    acc[date] = convertedData[date];
    return acc;
  }, {});
};

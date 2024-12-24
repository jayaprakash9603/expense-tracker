export const convertAndSortData = (data, order) => {
  const convertedData = data.reduce((acc, item) => {
    const date = item.date;

    if (!acc[date]) {
      acc[date] = [];
    }

    const index = acc[date].length + 1;

    acc[date].push({
      id: item.id,
      index: index,
      expenseName: item.expense.expenseName,
      amount: item.expense.amount,
      type: item.expense.type,
      paymentMethod: item.expense.paymentMethod,
      netAmount: item.expense.netAmount,
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

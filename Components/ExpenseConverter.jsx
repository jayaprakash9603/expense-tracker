import { useEffect } from "react";
import "../Components/Home.jsx";
const ExpenseConverter = ({ inputData, onDataConverted }) => {
  useEffect(() => {
    const convertData = (data) => {
      return data.reduce((acc, item) => {
        const date = item.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          id: item.id,
          expenseName: item.expense.expenseName,
          amount: item.expense.amount,
          type: item.expense.type,
          paymentMethod: item.expense.paymentMethod,
          netAmount: item.expense.netAmount,
        });
        return acc;
      }, {});
    };

    if (inputData && inputData.length > 0) {
      const convertedData = convertData(inputData);
      onDataConverted(convertedData);
    }
  }, [inputData, onDataConverted]);

  return null; // This component does not render anything
};

export default ExpenseConverter;

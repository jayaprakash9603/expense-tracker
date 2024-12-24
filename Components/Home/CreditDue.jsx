const CreditDue = ({ filteredData }) => {
  const creditDueAmount = () => {
    return Object.keys(filteredData).reduce((total, date) => {
      const data = filteredData[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          if (expense.paymentMethod === "creditNeedToPaid") {
            return sum + (expense.amount || 0);
          }
          if (expense.paymentMethod === "creditPaid") {
            return sum - (expense.amount || 0);
          }
          return sum;
        }, 0)
      );
    }, 0);
  };

  return (
    <h3>
      Credit Due: <span className="fw-bold">{creditDueAmount()}</span>
    </h3>
  );
};

export default CreditDue;

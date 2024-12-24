const TotalSalary = ({ filteredData }) => {
  const totalSalaryAmount = () => {
    return Object.keys(filteredData).reduce((total, date) => {
      const data = filteredData[date] || [];
      return (
        total +
        data.reduce((sum, expense) => {
          if (
            (expense.type === "gain" || expense.type === "loss") &&
            expense.paymentMethod === "creditNeedToPaid"
          ) {
            return sum;
          }
          return sum + (expense.netAmount || 0);
        }, 0)
      );
    }, 0);
  };

  return (
    <h3>
      Total Salary Amount:{" "}
      <span className="fw-bold">{totalSalaryAmount()}</span>
    </h3>
  );
};

export default TotalSalary;

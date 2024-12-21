import React, { useEffect, useState } from "react";
import SummaryTable from "./SummaryTable";
import { expensesData, fetchData, columns } from "./Input Fields/TableInput";
const SummaryTableHelper = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        const result = await fetchData();
        setData(result.expensesData || []);
        setError(result.error);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);
  return (
    <div>
      <SummaryTable
        data={data}
        loading={loading}
        error={error}
        columns={columns}
      />
    </div>
  );
};

export default SummaryTableHelper;

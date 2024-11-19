import React, { useEffect, useState } from "react";
import "../Styles/TestTable.css";

const TestTable = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  // Define the columns we want to display
  const columnNames = ["expenseName", "comments", "amount"];

  return (
    <div className="table-div">
      <table className="custom-table">
        <thead className="custom-thead">
          <tr className="custom-tr">
            {columnNames.map((header, index) => (
              <th className="custom-th" key={index}>
                {header.replace(/([A-Z])/g, " $1").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="custom-tbody">
          {data.map((item, rowIndex) => {
            const expense = item.expense;
            return (
              <tr className="custom-tr" key={rowIndex}>
                {columnNames.map((col, colIndex) => (
                  <td className="custom-td" key={colIndex}>
                    {expense[col]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/expenses/last-month"
        );
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <TestTable data={data} />
    </div>
  );
};

export default App;

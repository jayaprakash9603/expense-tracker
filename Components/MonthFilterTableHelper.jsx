import React, { useEffect, useState } from "react";
import FilteredTable from "./FilteredTable";

const MonthFilterTableHelper = (filteredData) => {
  const [expense, setExpense] = useState();

  useEffect(() => {
    setExpense(filteredData);
  }, [filteredData]);

  return <div></div>;
};

export default MonthFilterTableHelper;

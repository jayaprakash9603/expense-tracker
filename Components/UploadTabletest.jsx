import React, { useEffect, useState } from "react";
import UploadTable from "./UploadTable";
import axios from "axios";
import { constructFrom } from "date-fns";

const UploadTabletest = () => {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/fetch-expenses");
        console.log(res);
        if (res && res.data) {
          setExpenses(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/*<UploadTable
        expenses={expenses}
        setExpenses={setExpenses}
        isNewData={true}
      />*/}
    </div>
  );
};

export default UploadTabletest;

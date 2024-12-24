import { useEffect, useState } from "react";
import axios from "axios";

const useFetchExpenses = (url) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        if (res && res.data) {
          setExpenses(res.data);
        }
      })
      .catch((err) => setError(err));
  }, [url]);

  return { expenses, error };
};

export default useFetchExpenses;

import { useState, useEffect } from "react";
import axios from "axios";

const useFetchLogTypes = () => {
  const [logTypes, setLogTypes] = useState([]);
  const [filteredLogTypes, setFilteredLogTypes] = useState([]);

  useEffect(() => {
    const fetchLogTypes = () => {
      axios
        .get("http://localhost:3000/audit-logs/audit-types")
        .then((response) => {
          setLogTypes(response.data);
          setFilteredLogTypes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching log types:", error);
        });
    };

    fetchLogTypes();
    const interval = setInterval(fetchLogTypes, 100000000);

    return () => clearInterval(interval);
  }, []);

  return { logTypes, filteredLogTypes, setFilteredLogTypes };
};

export default useFetchLogTypes;

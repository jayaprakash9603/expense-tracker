// useExpenses.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllExpenses } from "./expense.actions";

const useExpenses = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expense);

  useEffect(() => {
    dispatch(getAllExpenses());
  }, [dispatch]);

  return {
    expenses,
    loading,
    error,
  };
};

export default useExpenses;

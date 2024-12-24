import axios from "axios";

export const getExpenses = async () => {
  const response = await axios.get("http://localhost:3000/fetch-expenses");
  return response.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`http://localhost:3000/name/${id}`);
};

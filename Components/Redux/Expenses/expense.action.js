import { api } from "../../config/api";
import {
  CREATE_EXPENSE_FAILURE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  GET_ALL_EXPENSES_FAILURE,
  GET_ALL_EXPENSES_REQUEST,
  GET_ALL_EXPENSES_SUCCESS,
  EDIT_EXPENSE_FAILURE,
  EDIT_EXPENSE_REQUEST,
  EDIT_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_SUCCESS,
} from "./expense.actionType";

// Get all expenses
export const getExpensesAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_EXPENSES_REQUEST });

  try {
    const { data } = await api.get(`/fetch-expenses`);
    dispatch({ type: GET_ALL_EXPENSES_SUCCESS, payload: data });
    console.log("Get expenses data:", data);
  } catch (error) {
    console.log("Error fetching expenses:", error);
    dispatch({ type: GET_ALL_EXPENSES_FAILURE, payload: error });
  }
};

// Create expense
export const createExpenseAction = (expenseData) => async (dispatch) => {
  dispatch({ type: CREATE_EXPENSE_REQUEST });

  try {
    const response = await api.post("/add-expense", expenseData); // Adjust the API endpoint
    dispatch({ type: CREATE_EXPENSE_SUCCESS, payload: response.data });
    console.log("Expense created successfully:", response.data);
  } catch (error) {
    dispatch({ type: CREATE_EXPENSE_FAILURE, payload: error.message });
    console.error("Error creating expense:", error);
  }
};

// Edit expense
export const editExpenseAction =
  (expenseId, updatedData) => async (dispatch) => {
    dispatch({ type: EDIT_EXPENSE_REQUEST });

    try {
      const response = await api.put(`/edit-expense/${expenseId}`, updatedData); // Adjust the API endpoint
      dispatch({ type: EDIT_EXPENSE_SUCCESS, payload: response.data });
      console.log("Expense edited successfully:", response.data);
    } catch (error) {
      dispatch({ type: EDIT_EXPENSE_FAILURE, payload: error.message });
      console.error("Error editing expense:", error);
    }
  };

// Delete expense
export const deleteExpenseAction = (expenseId) => async (dispatch) => {
  dispatch({ type: DELETE_EXPENSE_REQUEST });

  try {
    await api.delete(`/delete-expense/${expenseId}`); // Adjust the API endpoint
    dispatch({ type: DELETE_EXPENSE_SUCCESS, payload: expenseId });
    console.log("Expense deleted successfully:", expenseId);
  } catch (error) {
    dispatch({ type: DELETE_EXPENSE_FAILURE, payload: error.message });
    console.error("Error deleting expense:", error);
  }
};

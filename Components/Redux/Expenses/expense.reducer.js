import {
  GET_ALL_EXPENSES_REQUEST,
  GET_ALL_EXPENSES_SUCCESS,
  GET_ALL_EXPENSES_FAILURE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  CREATE_EXPENSE_FAILURE,
  EDIT_EXPENSE_SUCCESS,
  EDIT_EXPENSE_FAILURE,
  EDIT_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
} from "./expense.actionType";

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

export const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EXPENSES_REQUEST:
    case CREATE_EXPENSE_REQUEST:
    case EDIT_EXPENSE_REQUEST:
    case DELETE_EXPENSE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_ALL_EXPENSES_SUCCESS:
    case DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: action.payload,
      };
    case CREATE_EXPENSE_SUCCESS:
    case EDIT_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: [...state.expenses, action.payload], // Append the newly created expense to the state
      };
    case GET_ALL_EXPENSES_FAILURE:
    case CREATE_EXPENSE_FAILURE:
    case EDIT_EXPENSE_FAILURE:
    case DELETE_EXPENSE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

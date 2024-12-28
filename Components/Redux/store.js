import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // Named import for redux-thunk
import { expenseReducer } from "./Expenses/expense.reducer";

const rootReducers = combineReducers({
  expense: expenseReducer,
});

const store = legacy_createStore(rootReducers, applyMiddleware(thunk));

export default store;

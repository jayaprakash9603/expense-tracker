import React from "react";

const ShowExpensesButton = ({ handleShowExpenses }) => (
  <div className="">
    <button
      className="send-email-btn mt-3"
      style={{
        width: "18vw",
        marginLeft: "1vw",
        border: "none",
        outline: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "rgb(250, 113, 113)",
      }}
      onClick={handleShowExpenses}
    >
      Show Expenses
    </button>
  </div>
);

export default ShowExpensesButton;

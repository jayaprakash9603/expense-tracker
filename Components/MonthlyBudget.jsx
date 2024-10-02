import React from "react";
import "../Styles/MonthlyBudget.css";
import BudgetPieChart from "./BudgetPieChart";
const MonthlyBudget = () => {
  return (
    <div className="container">
      <div className="main-text">
        <h2>Personal monthly budget</h2>
      </div>
      <div className="table-image-container">
        <div className="my-table-container">
          <table className="my-table table-margin-1">
            <tr>
              <th className="rowspan-cell first-color" rowSpan="3">
                PROJECTED MONTHLY INCOME
              </th>
              <td className="first-cell-color">Income 1</td>
              <td className="first-cell-color small-width">2000</td>
            </tr>
            <tr>
              <td className="second-cell-color">Extra Income</td>
              <td className="second-cell-color small-width">1000</td>
            </tr>
            <tr>
              <td className="third-cell-color">Total Month income</td>
              <td className="third-cell-color">5000</td>
            </tr>
            <tr>
              <th className=" second-color" rowSpan="3">
                ACTUAL MONTHLY INCOME
              </th>
              <td className="first-cell-color">Data 1</td>
              <td className="first-cell-color small-width">Data 1</td>
            </tr>
            <tr>
              <td className="second-cell-color">Data 2</td>
              <td className="second-cell-color small-width">Data 2</td>
            </tr>
            <tr>
              <td className="third-cell-color">Data 3</td>
              <td className="third-cell-color small-width">Data 3</td>
            </tr>
          </table>
          <table className="my-table table-margin-2">
            <tr>
              <th className="rowspan-cell first-color">
                PROJECTED MONTHLY INCOME
              </th>
              <td className="first-cell-color">Income 1</td>
              <td className="first-cell-color small-width">2000</td>
            </tr>
            <tr>
              <th className="rowspan-cell second-color">
                ACTUAL MONTHLY INCOME
              </th>
              <td className="second-cell-color">Extra Income</td>
              <td className="second-cell-color small-width">1000</td>
            </tr>
            <tr>
              <td className="third-cell-color">PROJECTED MONTHLY INCOME</td>
              <td className="third-cell-color"></td>
              <td className="third-cell-color">5000</td>
            </tr>
          </table>
        </div>
        <div className="table-image">
          <img src="../images/monthly-budget.jpeg" />
        </div>
      </div>
      <div className="table-container">
        <table className="budget-table">
          <thead>
            <tr>
              <th>HOUSING</th>
              <th>Projected cost</th>
              <th>Actual cost</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mortgage or rent</td>
              <td>$1,500</td>
              <td>$1,400</td>
              <td>$100</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>$60</td>
              <td>$100</td>
              <td>-$40</td>
            </tr>
            <tr>
              <td>Electricity</td>
              <td>$50</td>
              <td>$60</td>
              <td>-$10</td>
            </tr>
            <tr>
              <td>Gas</td>
              <td>$200</td>
              <td>$180</td>
              <td>$20</td>
            </tr>
            <tr>
              <td>Water and sewer</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Cable</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Waste removal</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Maintenance or repairs</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Supplies</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Other</td>
              <td>$0</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>$1,810</strong>
              </td>
              <td>
                <strong>$1,740</strong>
              </td>
              <td>
                <strong>$70</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BudgetPieChart />
    </div>
  );
};

export default MonthlyBudget;

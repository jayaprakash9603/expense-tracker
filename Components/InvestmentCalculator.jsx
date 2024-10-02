import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/InvestmentCalculator.css";

const InvestmentCalculator = () => {
  const [investmentType, setInvestmentType] = useState("sip");
  const [sipAmount, setSipAmount] = useState("25000");
  const [sipPeriod, setSipPeriod] = useState("10");
  const [sipReturn, setSipReturn] = useState("12");
  const [lumpSumAmount, setLumpSumAmount] = useState("25000");
  const [investmentPeriod, setInvestmentPeriod] = useState("10");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [results, setResults] = useState(null);

  const SIP_LIMIT = 100000; // Maximum SIP amount
  const LUMPSUM_LIMIT = 500000; // Maximum Lumpsum amount
  const handleRadioChange = (e) => {
    setInvestmentType(e.target.value);
    setResults(null); // Reset results when changing investment type
  };

  const handleSipAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || Number(value) <= SIP_LIMIT) {
      setSipAmount(value);
    }
    if (value.length > 8) {
      setSipAmount(value.substr(0, 8));
    } else {
      setSipAmount(value);
    }
  };

  const handleLumpSumAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || Number(value) <= LUMPSUM_LIMIT) {
      setLumpSumAmount(value);
    }
    if (value.length > 8) {
      setLumpSumAmount(value.substr(0, 8));
    } else {
      setLumpSumAmount(value);
    }
  };

  const handleSipPeriodChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSipPeriod("");
    } else if (/^\d*$/.test(value)) {
      const newValue = Math.max(0, Math.min(50, value));
      setSipPeriod(newValue);
    }
  };

  const handleSipReturnChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSipReturn("");
    } else if (/^\d*$/.test(value)) {
      const newValue = Math.max(0, Math.min(50, value));
      setSipReturn(newValue);
    }
  };

  const handleInvestmentPeriodChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setInvestmentPeriod("");
    } else if (/^\d*$/.test(value)) {
      const newValue = Math.max(0, Math.min(60, value));
      setInvestmentPeriod(newValue);
    }
  };

  const handleExpectedReturnChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setExpectedReturn("");
    } else if (/^\d*$/.test(value)) {
      const newValue = Math.max(0, Math.min(50, value));
      setExpectedReturn(newValue);
    }
  };

  const handleInvestmentTypeChange = (type) => {
    if (type === "sip") {
      // When switching to SIP, set values from Lumpsum as defaults
      setSipAmount(lumpSumAmount);
      setSipPeriod(investmentPeriod);
      setSipReturn(expectedReturn);
    } else {
      // When switching to Lumpsum, set values from SIP as defaults
      setLumpSumAmount(sipAmount);
      setInvestmentPeriod(sipPeriod);
      setExpectedReturn(sipReturn);
    }
    setInvestmentType(type);
    setResults(null); // Reset results when changing investment type
  };

  // Calculate results whenever inputs change
  useEffect(() => {
    if (
      investmentType === "sip" &&
      (sipAmount === "" || sipPeriod === "" || sipReturn === "")
    ) {
      setResults(null);
      return;
    } else if (
      investmentType === "lumpsum" &&
      (lumpSumAmount === "" || investmentPeriod === "" || expectedReturn === "")
    ) {
      setResults(null);
      return;
    }

    let investedAmount = 0;
    let estimatedReturns = 0;
    let totalValue = 0;

    if (investmentType === "sip") {
      const monthlyInvestment = Number(sipAmount);
      const annualReturn = Number(sipReturn) / 100;
      const monthlyReturn = annualReturn / 12;
      const months = Number(sipPeriod) * 12;

      if (monthlyInvestment > 0 && monthlyReturn >= 0 && months > 0) {
        const futureValue =
          monthlyInvestment *
          (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) *
            (1 + monthlyReturn));
        estimatedReturns = futureValue - monthlyInvestment * months;
        investedAmount = monthlyInvestment * months;
        totalValue = futureValue;
      }
    } else if (investmentType === "lumpsum") {
      investedAmount = Number(lumpSumAmount);
      estimatedReturns =
        investedAmount *
        (Math.pow(1 + Number(expectedReturn) / 100, Number(investmentPeriod)) -
          1);
      totalValue = investedAmount + estimatedReturns;
    }

    setResults({
      investedAmount: Math.round(investedAmount),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue),
    });
  }, [
    investmentType,
    sipAmount,
    sipPeriod,
    sipReturn,
    lumpSumAmount,
    investmentPeriod,
    expectedReturn,
  ]);

  return (
    <div
      className="container mt-4 p-3 border"
      style={{ width: "550px", height: "600px" }}
    >
      <h2 className="text-center mb-3">Investment Calculator</h2>
      <div className="d-flex mb-3">
        <div className="d-flex mb-3 justify-content-center">
          <button
            className={`btn mx-2 ${investmentType === "sip" ? "active" : ""}`}
            onClick={() => handleInvestmentTypeChange("sip")}
          >
            SIP
          </button>
          <button
            className={`btn mx-2 ${
              investmentType === "lumpsum" ? "active" : ""
            }`}
            onClick={() => handleInvestmentTypeChange("lumpsum")}
          >
            Lumpsum
          </button>
        </div>
      </div>

      {/* Conditionally Render Based on Investment Type */}
      {investmentType === "sip" ? (
        <div className="mt-3">
          <div className="mb-3">
            <label>Monthly Investment</label>
            <div className="d-flex mt-2 position-relative">
              <div className="px-4 h-200 d-flex align-items-center justify-content-center bg-light border border-end-0 rounded-start">
                ₹
              </div>
              <input
                type="number"
                id="monthlySipAmount"
                className="form-control border border-start-0 rounded-start-0 rounded-right text-base w-100 h-100 px-2 placeholder-gray-400"
                placeholder="Enter monthly SIP amount"
                value={sipAmount}
                min={0}
                max={SIP_LIMIT}
                onChange={handleSipAmountChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Time period</label>
            <div className="d-flex align-items-center">
              <input
                type="range"
                className="form-range"
                min="0"
                max="60"
                value={sipPeriod}
                onChange={handleSipPeriodChange}
              />
              <input
                type="text"
                className="form-control ms-2"
                value={sipPeriod}
                onChange={handleSipPeriodChange}
                placeholder="Period (Years)"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Expected return rate (p.a)</label>
            <div className="d-flex align-items-center">
              <input
                type="range"
                className="form-range"
                min="1" // Minimum is 1
                max="50"
                value={sipReturn}
                onChange={handleSipReturnChange}
              />
              <input
                type="text"
                className="form-control ms-2"
                style={{ width: "80px" }} // Adjusted width
                value={sipReturn}
                onChange={handleSipReturnChange}
                placeholder="Returns (%)"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="mb-3">
            <label>Total Investment</label>
            <div className="d-flex mt-2 position-relative">
              <div className="px-4 h-200 d-flex align-items-center justify-content-center bg-light border border-end-0 rounded-start">
                ₹
              </div>
              <input
                type="text"
                className="form-control border border-start-0 rounded-start-0 rounded-right text-base w-100 h-100 px-2 placeholder-gray-400"
                placeholder="Enter total investment"
                value={lumpSumAmount}
                max={LUMPSUM_LIMIT}
                onChange={handleLumpSumAmountChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Time period</label>
            <div className="d-flex align-items-center">
              <input
                type="range"
                className="form-range"
                min="0"
                max="60"
                value={investmentPeriod}
                onChange={handleInvestmentPeriodChange}
              />
              <input
                type="text"
                className="form-control ms-2"
                value={investmentPeriod}
                onChange={handleInvestmentPeriodChange}
                placeholder="Period (Years)"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Expected return rate (p.a)</label>
            <div className="d-flex align-items-center">
              <input
                type="range"
                className="form-range"
                min="1" // Minimum is 1
                max="50"
                value={expectedReturn}
                onChange={handleExpectedReturnChange}
              />
              <input
                type="text"
                className="form-control ms-2"
                style={{ width: "80px" }} // Adjusted width
                value={expectedReturn}
                onChange={handleExpectedReturnChange}
                placeholder="Returns (%)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-4 border rounded p-3">
          <h5>Results</h5>
          <p>
            Invested Amount: <strong>₹{results.investedAmount || 0}</strong>
          </p>
          <p>
            Estimated Returns: <strong>₹{results.estimatedReturns || 0}</strong>
          </p>
          <p>
            Total Value: <strong>₹{results.totalValue || 0}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Styles/SearchExpenses.css";
import useFetchLogTypes from "./useFetchLogTypes";
import ErrorMessage from "./ErrorMessage";
import ShowExpensesButton from "./ShowExpensesButton";
import Filters from "./Filters";
import SearchInput from "./SearchInput";
import handleShowExpenses from "./handleShowExpenses"; // Import the utility function
import handleClearAll from "./handleClearAll"; // Import the utility function
import { handleClick, handleBlur, handleKeyDown } from "./handleSearchEvents"; // Import event handler functions
import FiltersHeader from "./FilterHeader";

const SearchExpenses = ({ Url, setUrl }) => {
  const { logTypes, filteredLogTypes, setFilteredLogTypes } =
    useFetchLogTypes();

  const [searchTerm, setSearchTerm] = useState("");
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [fromDay, setFromDay] = useState("");
  const [toDay, setToDay] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsContainerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = logTypes.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLogTypes(filtered);
    } else {
      setFilteredLogTypes(logTypes);
    }

    setSelectedIndex(-1);
  };

  useEffect(() => {
    if (suggestionsContainerRef.current) {
      const selectedItem =
        suggestionsContainerRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, filteredLogTypes]);
  const handleShowExpensesClick = () => {
    handleShowExpenses(
      searchTerm,
      specificYear,
      specificMonth,
      fromDay,
      toDay,
      expenseName,
      paymentMethod,
      category,
      startYear,
      startMonth,
      minAmount,
      maxAmount,
      logTypes,
      setUrl,
      setError
    );
  };

  const handleClearAllClick = () => {
    handleClearAll(
      setSearchTerm,
      setSpecificYear,
      setSpecificMonth,
      setFromDay,
      setToDay,
      setExpenseName,
      setPaymentMethod,
      setCategory,
      setMinAmount,
      setMaxAmount,
      setUrl,
      setError,
      setFilteredLogTypes,
      logTypes,
      setSelectedIndex
    );
  };

  return (
    <div className="bg-white mt-0 d-flex flex-row">
      <div className="search-input">
        <ErrorMessage error={error} />
        {/* Use the new FiltersHeader component here */}
        <FiltersHeader handleClearAllClick={handleClearAllClick} />
        <div className="form-group mb-3">
          <SearchInput
            searchTerm={searchTerm}
            handleChange={handleChange}
            handleClick={() =>
              handleClick(
                searchTerm,
                logTypes,
                setFilteredLogTypes,
                setIsInputClicked
              )
            }
            handleBlur={() =>
              handleBlur(setIsInputClicked, setFilteredLogTypes)
            }
            handleKeyDown={(e) =>
              handleKeyDown(
                e,
                selectedIndex,
                setSelectedIndex,
                filteredLogTypes,
                setSearchTerm,
                setFilteredLogTypes
              )
            }
            isInputClicked={isInputClicked}
            filteredLogTypes={filteredLogTypes}
            suggestionsContainerRef={suggestionsContainerRef}
            selectedIndex={selectedIndex}
            setSearchTerm={setSearchTerm}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
        <Filters
          searchTerm={searchTerm}
          specificYear={specificYear}
          setSpecificYear={setSpecificYear}
          specificMonth={specificMonth}
          setSpecificMonth={setSpecificMonth}
          fromDay={fromDay}
          setFromDay={setFromDay}
          toDay={toDay}
          setToDay={setToDay}
          expenseName={expenseName}
          setExpenseName={setExpenseName}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          category={category}
          setCategory={setCategory}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
          startYear={startYear}
          setStartYear={setStartYear}
          startMonth={startMonth}
          setStartMonth={setStartMonth}
        />
        <ShowExpensesButton handleShowExpenses={handleShowExpensesClick} />
        {console.log(Url)}
      </div>
    </div>
  );
};

export default SearchExpenses;

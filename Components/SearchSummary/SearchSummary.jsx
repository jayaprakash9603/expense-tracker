import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toDate } from "date-fns";
import ExpenseTableParent from "../ExpenseTableParent";
import "../../Styles/SearchSummary.css";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "../SearchExpenses/ErrorMessage";
import useFetchLogTypes from "./useFetchLogTypes";
import handleClearAll from "./handleClearAll";
import FiltersHeader from "../SearchExpenses/FilterHeader";
import handleShowExpenses from "./handleShowExpenses";
import ShowExpensesButton from "../SearchExpenses/ShowExpensesButton";
import Filters from "./Filters";
import SearchInput from "../SearchExpenses/SearchInput";
import {
  handleClick,
  handleBlur,
  handleKeyDown,
} from "../SearchExpenses/handleSearchEvents";
const SearchSummary = ({ Url, setUrl }) => {
  const { logTypes, filteredLogTypes, setFilteredLogTypes } =
    useFetchLogTypes();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [specificYear, setSpecificYear] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificDay, setSpecificDay] = useState("");
  const suggestionsContainerRef = useRef(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const handleChange1 = (e) => {
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

    setSelectedIndex(-1); // Reset the selection index
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
    handleShowExpenses({
      searchTerm,
      specificYear,
      specificMonth,
      specificDay,
      startYear,
      endYear,
      startMonth,
      endMonth,
      setUrl,
      setError,
    });
  };

  const handleClearAllClick = () => {
    handleClearAll(
      setSearchTerm,
      setSpecificYear,
      setSpecificMonth,
      setSpecificDay,
      setStartYear,
      setEndYear,
      setStartMonth,
      setEndMonth,
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
        <FiltersHeader handleClearAllClick={handleClearAllClick} />
        <div className="form-group mb-3">
          <SearchInput
            searchTerm={searchTerm}
            handleChange={handleChange1}
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
          specificDay={specificDay}
          setSpecificDay={setSpecificDay}
          startYear={startYear}
          setStartYear={setStartYear}
          startMonth={startMonth}
          setStartMonth={setStartMonth}
          endYear={endYear}
          setEndYear={setEndYear}
          endMonth={endMonth}
          setEndMonth={setEndMonth}
        />

        <ShowExpensesButton handleShowExpenses={handleShowExpensesClick} />

        {console.log(Url)}
      </div>
    </div>
  );
};

export default SearchSummary;

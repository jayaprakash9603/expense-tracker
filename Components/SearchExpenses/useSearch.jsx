import { useState, useRef, useEffect } from "react";
import useFetchLogTypes from "./useFetchLogTypes";

const useSearch = (logTypes) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsContainerRef = useRef(null);
  const { filteredLogTypes, setFilteredLogTypes } = useFetchLogTypes();
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

  const handleClick = () => {
    setIsInputClicked(true);
    if (searchTerm.length > 0) {
      const nearestMatch = logTypes.find((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLogTypes(nearestMatch ? [nearestMatch] : []);
    }
  };

  const handleBlur = () => {
    setIsInputClicked(false);
    setFilteredLogTypes([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selectedSuggestion =
        selectedIndex >= 0
          ? filteredLogTypes[selectedIndex]
          : filteredLogTypes[0];

      if (selectedSuggestion) {
        setSearchTerm(selectedSuggestion);
        setFilteredLogTypes([]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(filteredLogTypes.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }
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

  return {
    searchTerm,
    setSearchTerm,
    isInputClicked,
    setIsInputClicked,
    selectedIndex,
    setSelectedIndex,
    suggestionsContainerRef,
    handleChange,
    handleClick,
    handleBlur,
    handleKeyDown,
  };
};

export default useSearch;

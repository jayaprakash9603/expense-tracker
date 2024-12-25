// utils/handleSearchEvents.js

export const handleClick = (
  searchTerm,
  logTypes,
  setFilteredLogTypes,
  setIsInputClicked
) => {
  setIsInputClicked(true);
  if (searchTerm.length > 0) {
    const nearestMatch = logTypes.find((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogTypes(nearestMatch ? [nearestMatch] : []);
  }
};

export const handleBlur = (setIsInputClicked, setFilteredLogTypes) => {
  setIsInputClicked(false);
  setFilteredLogTypes([]);
};

export const handleKeyDown = (
  e,
  selectedIndex,
  setSelectedIndex,
  filteredLogTypes,
  setSearchTerm,
  setFilteredLogTypes
) => {
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

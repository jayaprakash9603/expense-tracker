// utils/handleClearAll.js

const handleClearAll = (
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
) => {
  setSearchTerm("");
  setSpecificYear("");
  setSpecificMonth("");
  setSpecificDay("");
  setStartYear("");
  setEndYear("");
  setStartMonth("");
  setEndMonth("");
  setUrl("");
  setError("");
  setFilteredLogTypes(logTypes); // Reset suggestions to default
  setSelectedIndex(-1);
};

export default handleClearAll;

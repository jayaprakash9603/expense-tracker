// utils/handleClearAll.js

const handleClearAll = (
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
) => {
  setSearchTerm("");
  setSpecificYear("");
  setSpecificMonth("");
  setFromDay("");
  setToDay("");
  setExpenseName("");
  setPaymentMethod("");
  setCategory("");
  setMinAmount("");
  setMaxAmount("");
  setUrl("");
  setError("");
  setFilteredLogTypes(logTypes);
  setSelectedIndex(-1);
};

export default handleClearAll;

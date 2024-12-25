// utils/handleClearAll.js

const handleClearAll = (
  setSearchTerm,
  setSpecificYear,
  setSpecificMonth,
  setSpecificDay,
  setExpenseId,
  setActionType,
  setNMinutes,
  setNSeconds,
  setNHours,
  setNDays,
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
  setExpenseId("");
  setActionType("");
  setNMinutes("");
  setNSeconds("");
  setNHours("");
  setNDays("");
  setUrl("");
  setError("");
  setFilteredLogTypes(logTypes);
  setSelectedIndex(-1);
};

export default handleClearAll;

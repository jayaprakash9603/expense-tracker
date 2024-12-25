import React from "react";

const SearchInput = ({
  searchTerm,
  handleChange,
  handleClick,
  handleBlur,
  handleKeyDown,
  isInputClicked,
  filteredLogTypes,
  suggestionsContainerRef,
  selectedIndex,
  setSearchTerm,
  setSelectedIndex,
}) => (
  <div style={{ position: "relative" }} className="search-expense-period-div">
    <input
      type="text"
      className="search-expense-period"
      value={searchTerm}
      onChange={handleChange}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      placeholder="Search expense period..."
      style={{
        width: "100%",
        marginTop: "5px",
        fontFamily: "Arial, sans-serif",
        zIndex: 1,
      }}
    />
    {isInputClicked && filteredLogTypes.length > 0 && (
      <div
        ref={suggestionsContainerRef}
        style={{
          position: "absolute",
          top: "100%",
          left: "1vw",
          width: "100%",
          border: "1px solid white",
          borderTop: "none",
          backgroundColor: "white",
          zIndex: 10,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxHeight: "200px",
          overflowY: "auto",
          borderRadius: "0 0 5px 5px",
          scrollbarWidth: "thin",
          scrollbarColor: "#A7C4C2 transparent",
        }}
      >
        {filteredLogTypes.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#333",
              backgroundColor:
                selectedIndex === index ? "#79E0EE" : "transparent",
              transition: "background-color 0.3s ease",
            }}
            onMouseDown={() => setSearchTerm(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {item}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SearchInput;

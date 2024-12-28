import React from "react";

const Loader = () => {
  const loaderContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional background for better visibility
    zIndex: 9999, // Ensures it's above other elements
  };

  const loaderStyle = {
    border: "8px solid #f3f3f3", // Light gray
    borderTop: "8px solid #3498db", // Blue
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 0.5s linear infinite",
  };

  return (
    <div style={loaderContainerStyle}>
      <div style={loaderStyle}></div>
    </div>
  );
};

export default Loader;

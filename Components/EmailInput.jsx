import React from "react";

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="form-group mb-3">
      <label>{label}</label>
      <select className="form-control" value={value} onChange={onChange}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;

import React from "react";

const Input = ({ label, type, value, onChange, required = false, placeholder }) => {
  return (
    <div className="inputContainer">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;

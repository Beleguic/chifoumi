import React from "react";
import Input from "./Input";

const Form = ({ title, fields, onSubmit, submitLabel, otherAction }) => {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            placeholder={field.placeholder}
          />
        ))}
        <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {submitLabel}
          </button>
          {otherAction}
        </div>
      </form>
    </div>
  );
};

export default Form;

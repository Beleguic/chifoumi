import React from "react";
import Input from "./Input";

const Form = ({ title, fields, onSubmit, submitLabel, className, otherAction }) => {
  return (
    <div className="formContainer">
      <h2>{title}</h2>
      <form onSubmit={onSubmit} className={className}>
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
        <div className="buttonContainer">
          <button
            type="submit"
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

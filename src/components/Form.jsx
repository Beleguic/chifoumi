import PropTypes from "prop-types"; // Import PropTypes
import Input from "./Input";

const Form = ({ title, fields, onSubmit, submitLabel, className, otherAction }) => {
  return (
    <div className="formContainer">
      <h2 className="text-xl font-bold">{title}</h2>
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
          <button type="submit">
            {submitLabel}
          </button>
          {otherAction}
        </div>
      </form>
    </div>
  );
};

// ✅ Add PropTypes validation
Form.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      placeholder: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  otherAction: PropTypes.node,
};

Form.defaultProps = {
  className: "",
  otherAction: null,
};

export default Form;

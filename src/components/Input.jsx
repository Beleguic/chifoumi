import PropTypes from "prop-types"; // Import PropTypes

const Input = ({ label, type, value, onChange, required, placeholder }) => {
  return (
    <div className="inputContainer">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border rounded px-3 py-2"
      />
    </div>
  );
};

// ✅ Add PropTypes validation
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string, 
};

Input.defaultProps = {
  label: "",
  required: false,
  placeholder: "",
};

export default Input;

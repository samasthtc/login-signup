import PropTypes from "prop-types";

export default function RadioButton({ id, name, value, checked, onChange, label }) {
  return (
    <div className="form-check">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label fw-medium">
        {label}
      </label>
    </div>
  );
}

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

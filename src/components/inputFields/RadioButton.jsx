import PropTypes from "prop-types";

export default function RadioButton({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  registerProps,
}) {
  const attributes = {
    id,
    name,
    value,
    checked,
    onChange,
    ...registerProps,
  };

  return (
    <div className="form-check">
      <input
        type="radio"
        {...(registerProps
          ? attributes
          : {
              id: id,
              name: name,
              value: value,
              checked: checked,
              onChange: onChange,
            })}
        className="form-check-input"
      />
      <label htmlFor={id} className="form-check-label fw-medium">
        {label}
      </label>
    </div>
  );
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  registerProps: PropTypes.any,
  value: PropTypes.string.isRequired,
};

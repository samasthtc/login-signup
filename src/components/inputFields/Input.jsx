import PropTypes from "prop-types";
import { useState } from "react";
export default function Input({
  type,
  name = "",
  autoComplete = "off",
  autoFocus = false,
  errorMessage,
  my = 3,
  value = undefined,
  onChange,
  registerProps,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFieldDirty, setIsFieldDirty] = useState(false);
  const { register, options } = registerProps || {};
  const validateFunc = options.validate;

  const registeredField = register(name, {
    ...options,
    validate: async (value) => {
      const result = await validateFunc(value);
      handleFieldChange();
      return result;
    },
  });
  const { name: nameFromProps, onChange: onChangeFromProps } = registeredField;
  name = nameFromProps || name;
  onChange = onChangeFromProps || onChange;

  const handleFieldChange = (e) => {
    !isFieldDirty && setIsFieldDirty(true);
    e && onChange(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <>
      <div className={`${type === "password" ? "input-group mt-3" : ""}`}>
        <div
          className={`form-floating ${type === "password" ? "" : `mt-${my}`} `}
        >
          <input
            type={
              type === "password"
                ? isPasswordVisible
                  ? "text"
                  : "password"
                : type
            }
            className={`form-control ${
              isFieldDirty || errorMessage
                ? errorMessage
                  ? "is-invalid input-error"
                  : "input-success"
                : ""
            }`}
            id={name}
            name={name}
            placeholder={
              name !== "search"
                ? `Enter your ${name}...`
                : "Search for users..."
            }
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            {...registeredField}
            value={value}
            onChange={onChange}
          />
          {name && (
            <label htmlFor={name} className="form-label">
              {name[0]?.toUpperCase() + name?.slice(1)}
            </label>
          )}
        </div>
        {type === "password" && (
          <span
            className={`input-group-text password-toggle-icon
              rounded-end ${
                isFieldDirty || errorMessage
                  ? errorMessage
                    ? "password-error text-danger"
                    : "password-success"
                  : ""
              }`}
            onClick={togglePasswordVisibility}
          >
            <i
              className={`fas  ${
                isPasswordVisible ? "fa-eye-slash" : "fa-eye"
              }`}
            ></i>
          </span>
        )}
        {errorMessage && (
          <p
            className={`error-text invalid-feedback mt-1 show  ${
              type === "password" ? "mb-0" : ""
            }`}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </>
  );
}

Input.propTypes = {
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  my: PropTypes.number,
  name: PropTypes.string,
  registerProps: PropTypes.object,
  value: PropTypes.any,
  errorMessage: PropTypes.string,
  isValidated: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.string.isRequired,
};

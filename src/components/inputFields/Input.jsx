import PropTypes from "prop-types";
import { useState } from "react";
export default function Input({
  type,
  name,
  autoComplete,
  autoFocus,
  errorMessage,
  my = 3,
  value,
  onChange,
  isValidated,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
              isValidated
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
            value={value}
            onChange={(e) => {
              onChange(e);
            }}
          />
          <label htmlFor={name} className="form-label">
            {name[0].toUpperCase() + name.slice(1)}
          </label>
        </div>
        {type === "password" && (
          <span
            className={`input-group-text password-toggle-icon
              rounded-end ${
                isValidated
                  ? errorMessage
                    ? "password-error"
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
            className={`error-text invalid-feedback mt-1 ${
              isValidated ? "show" : ""
            } ${type === "password" ? "mb-0" : ""}`}
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
  errorMessage: PropTypes.string,
  my: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  isValidated: PropTypes.bool,
  value: PropTypes.any,
};

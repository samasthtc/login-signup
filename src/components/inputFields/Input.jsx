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
  isDirty,
  showSuccess,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { register, options } = registerProps || {};
  const validateFunc = options?.validate;

  const inputType =
    type === "password" ? (isPasswordVisible ? "text" : "password") : type;
  return (
    <>
      <div className={`${type === "password" ? "input-group mt-3" : ""}`}>
        <div
          className={`form-floating ${type === "password" ? "" : `mt-${my}`} `}
        >
          <input
            {...(registerProps
              ? {
                  ...register(name, {
                    ...options,
                    validate: async (value) => await validateFunc(value),
                  }),
                }
              : {
                  name: name,
                  onChange: onChange,
                  value: value,
                })}
            type={inputType}
            className={`form-control ${
              isDirty &&
              (errorMessage
                ? "is-invalid input-error"
                : showSuccess && "input-success")
            }`}
            id={name}
            placeholder={
              name !== "search"
                ? `Enter your ${name}...`
                : "Search for users..."
            }
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
          <label htmlFor={name} className="form-label">
            {name[0]?.toUpperCase() + name?.slice(1)}
          </label>
        </div>
        {type === "password" && (
          <span
            className={`input-group-text password-toggle-icon
              rounded-end ${
                isDirty &&
                (errorMessage
                  ? "password-error text-danger"
                  : showSuccess && "password-success")
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

        {errorMessage && isDirty && (
          <p
            className={`error-text invalid-feedback mt-1 show ${
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
  errorMessage: PropTypes.any,
  onChange: PropTypes.func,
  type: PropTypes.string.isRequired,
  isDirty: PropTypes.bool,
  showSuccess: PropTypes.bool,
};

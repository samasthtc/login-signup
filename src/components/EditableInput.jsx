import PropTypes from "prop-types";
import { useState } from "react";
export default function EditableInput({
  type,
  id,
  name,
  placeholder,
  autoComplete,
  value,
  errorMessage,
  onChange,
  isValidated,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleEditing = () => {
    if (!isEditing) {
      setIsEditing(!isEditing);
    } else {
      !errorMessage && setIsEditing(!isEditing);
    }
  };

  const buttons =
    type === "password" ? (
      <>
        <span
          className="input-group-text password-toggle-icon "
          onClick={togglePasswordVisibility}
        >
          <i
            className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
          ></i>
        </span>
        <span
          className="input-group-text edit-icon"
          id="edit-password"
          onClick={toggleEditing}
        >
          <i className="fas fa-edit"></i>
        </span>
      </>
    ) : (
      <span
        className="input-group-text edit-icon"
        id={"edit-" + name}
        onClick={toggleEditing}
      >
        <i className="fas fa-edit"></i>
      </span>
    );

  const inputType =
    type === "password" ? (isPasswordVisible ? "text" : "password") : type;
  return (
    <>
      <div className="input-group mt-3">
        <div className="form-floating">
          <input
            type={inputType}
            className={`form-control ${
              isValidated && isEditing
                ? errorMessage
                  ? "is-invalid input-error"
                  : "input-success"
                : ""
            }`}
            id={id}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={!isEditing}
            value={value}
            onChange={(e) => {
              onChange(e);
            }}
          />
          <label htmlFor="name" className="form-label">
            {name[0].toUpperCase() + name.slice(1)}
          </label>
        </div>
        {buttons}
      </div>
      {errorMessage && (
        <p
          className={`error-text invalid-feedback mt-1 ${
            isValidated ? "show" : ""
          } ${type === "password" ? "mb-0" : ""}`}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}

EditableInput.propTypes = {
  autoComplete: PropTypes.string,
  errorMessage: PropTypes.string,
  id: PropTypes.string,
  isValidated: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

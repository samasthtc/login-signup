import PropTypes from "prop-types";
import { useState } from "react";
export default function EditableInput({
  type,
  name,
  autoComplete,
  value,
  errorMessage,
  onChange,
  isValidated,
  editingState,
  setEditingState,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleEditing = () => {
    if (!editingState) {
      setEditingState(!editingState, name);
    } else {
      !errorMessage && setEditingState(!editingState, name);
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
              isValidated && editingState
                ? errorMessage
                  ? "is-invalid input-error"
                  : "input-success"
                : ""
            }`}
            id={name}
            name={name}
            placeholder={`Enter your ${name}...`}
            autoComplete={autoComplete}
            disabled={!editingState}
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
  editingState: PropTypes.any,
  errorMessage: PropTypes.string,
  isValidated: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  setEditingState: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.string,
};

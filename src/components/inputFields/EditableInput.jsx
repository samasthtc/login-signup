import PropTypes from "prop-types";
import { useState } from "react";
export default function EditableInput({
  type,
  name = "",
  autoComplete = "off",
  value = undefined,
  errorMessage,
  onChange,
  registerProps,
  isDirty,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { register, options } = registerProps || {};
  const validateFunc = options?.validate;
  let registeredField;

  if (register) {
    registeredField = register(name, {
      ...options,
      validate: async (value) => await validateFunc(value),
    });

    const { name: nameFromProps, onChange: onChangeFromProps } =
      registeredField;
    name = nameFromProps || name;
    onChange = onChangeFromProps || onChange;
  }

  // const buttons =
  //   type === "password" ? (
  //     <>
  //       <span
  //         className="input-group-text password-toggle-icon "
  //         onClick={togglePasswordVisibility}
  //       >
  //         <i
  //           className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
  //         ></i>
  //       </span>
  //       <span
  //         className="input-group-text edit-icon"
  //         id="edit-password"
  //         onClick={toggleEditing}
  //       >
  //         <i className="fas fa-edit"></i>
  //       </span>
  //     </>
  //   ) : (
  //     <span
  //       className="input-group-text edit-icon"
  //       id={"edit-" + name}
  //       onClick={toggleEditing}
  //     >
  //       <i className="fas fa-edit"></i>
  //     </span>
  //   );

  const inputType =
    type === "password" ? (isPasswordVisible ? "text" : "password") : type;
  return (
    <>
      <div className="input-group mt-3">
        <div className="form-floating">
          <input
            type={inputType}
            className={`form-control ${
              errorMessage
                ? "is-invalid input-error"
                : isDirty && "input-success"
            }`}
            id={name}
            name={name}
            placeholder={`Enter your ${name}...`}
            autoComplete={autoComplete}
            // disabled={!editingState}
            value={value}
            onChange={onChange}
            {...registeredField}
          />
          <label htmlFor="name" className="form-label">
            {name[0].toUpperCase() + name.slice(1)}
          </label>
        </div>
        {/* {buttons} */}
        {type === "password" && (
          <span
            className={`input-group-text password-toggle-icon
              rounded-end ${
                isDirty || errorMessage
                  ? errorMessage
                    ? "password-error text-danger"
                    : "password-success"
                  : ""
              }`}
            onClick={togglePasswordVisibility}
          >
            <i
              className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </span>
        )}
      </div>
      {errorMessage && (
        <p
          className={`error-text invalid-feedback mt-1 show ${
            type === "password" ? "mb-0" : ""
          }`}
        >
          {errorMessage}
        </p>
      )}
    </>
  );
}

EditableInput.propTypes = {
  autoComplete: PropTypes.string,
  errorMessage: PropTypes.any,
  isDirty: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  registerProps: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
};

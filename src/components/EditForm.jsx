import PropTypes from "prop-types";
import { useCallback, useContext, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../auth/authService";
import UsersListContext from "../context/usersList/UsersListContext";
import debounce from "../utils/debounce";
import CardContainer from "./common/CardContainer";
import EditableInput from "./EditableInput";

export default function EditForm({ user, onSubmit }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  // TODO: join all states into one object
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initialValidationState = {
    isNameValidated: true,
    isNameValid: true,
    isEmailValidated: true,
    isEmailValid: true,
    isPasswordValidated: true,
    isPasswordValid: true,
  };

  function validationReducer(state, action) {
    switch (action.type) {
      case "VALIDATE_FIELD":
        return {
          ...state,
          [`is${action.field}Validated`]: true,
          [`is${action.field}Valid`]: action.isValid,
        };
      case "SET_CREDENTIALS_VALIDITY":
        return {
          ...state,
          isEmailValidated: true,
          isEmailValid: action.isValid,
          isPasswordValidated: true,
          isPasswordValid: action.isValid,
          areCredentialsValid: action.isValid,
        };
      default:
        return state;
    }
  }

  const [validationState, dispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const isValid =
    validationState.isNameValid &&
    validationState.isEmailValid &&
    validationState.isPasswordValid;

  const handleFieldChange = (e, field, setField) => {
    setField(e.target.value);
    debouncedValidation(e.target.value, field);
  };

  const handleFieldValidation = (value, field) => {
    const { isValid, errorMessage } = validateField(
      value,
      field === "name"
        ? validateName
        : field === "email"
        ? validateEmail
        : validatePassword
    );

    if (field === "name") setNameError(isValid ? "" : errorMessage);
    if (field === "email") setEmailError(isValid ? "" : errorMessage);
    if (field === "password") setPasswordError(isValid ? "" : errorMessage);

    // @ts-ignore
    dispatch({
      type: "VALIDATE_FIELD",
      field: field.charAt(0).toUpperCase() + field.slice(1),
      isValid,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidation = useCallback(
    debounce((value, field) => handleFieldValidation(value, field), 600),
    [handleFieldValidation]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFieldValidation(name, "name");
    handleFieldValidation(email, "email");
    handleFieldValidation(password, "password");

    if (
      !validationState.isNameValid ||
      !validationState.isEmailValid ||
      !validationState.isPasswordValid
    ) {
      return;
    }

    if (isValid) {
      const result = onSubmit({ ...user, name, email, password }, usersList);
      if (result.isValid) {
        // @ts-ignore
        setUsersList(result.updatedList);
      }
    }
  };

  return (
    <CardContainer>
      <h1 className="title text-center ">Edit Profile</h1>

      <form
        action="#"
        id="edit-form"
        className=" w-100"
        onSubmit={handleSubmit}
        noValidate
      >
        <EditableInput
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name..."
          autoComplete="off"
          value={name}
          onChange={(e) => {
            handleFieldChange(e, "name", setName);
          }}
          errorMessage={nameError}
          isValidated={validationState.isNameValidated}
        />

        <EditableInput
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email..."
          autoComplete="email"
          value={email}
          onChange={(e) => {
            handleFieldChange(e, "email", setEmail);
          }}
          errorMessage={emailError}
          isValidated={validationState.isEmailValidated}
        />

        <EditableInput
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password..."
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            handleFieldChange(e, "password", setPassword);
          }}
          errorMessage={passwordError}
          isValidated={validationState.isPasswordValidated}
        />

        <button
          type="submit"
          className="btn border-2 rounded-pill btn-outline-primary
           mt-3 mb-1 text-semibold me-2"
        >
          Save Changes
        </button>

        <Link className=" text-decoration-none" to="/">
          <button
            type="button"
            className="btn border-2 rounded-pill btn-outline-secondary mt-3 mb-1
              text-semibold text-black-50"
          >
            Back
          </button>
        </Link>
      </form>
    </CardContainer>
  );
}

EditForm.propTypes = {
  onSubmit: PropTypes.func,
  user: PropTypes.shape({
    email: PropTypes.any,
    name: PropTypes.any,
    password: PropTypes.any,
  }),
};

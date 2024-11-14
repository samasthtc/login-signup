import LoggedInUserContext from "../../context/loggedInUser/LoggedInUserContext";
import PropTypes from "prop-types";
import { useCallback, useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../../auth/authService";
import UsersListContext from "../../context/usersList/UsersListContext";
import debounce from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import Input from "../Input";

export default function LoginRegisterForm({ type, onSubmit }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { setLoggedInUser } = useContext(LoggedInUserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initialValidationState = {
    isNameValidated: false,
    isNameValid: false,
    isEmailValidated: false,
    isEmailValid: false,
    isPasswordValidated: false,
    isPasswordValid: false,
    areCredentialsValid: false,
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
  const navigate = useNavigate();

  const handleFieldChange = (e, field, setField) => {
    setField(e.target.value);
    !(type === "login") && debouncedValidation(e.target.value, field);
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
    if (field === "email")
      setEmailError(isValid ? "" : type === "login" ? " " : errorMessage);
    if (field === "password")
      setPasswordError(
        isValid ? "" : type === "login" ? "Invalid credentials." : errorMessage
      );

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

    if (type !== "login") {
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
        if (type === "register" || type === "add") {
          const result = onSubmit({ name, email, password }, usersList);
          if (result.isValid) {
            // @ts-ignore
            setUsersList(result.updatedList);
            type === "register" && navigate("/login");
          } else {
            setEmailError(result.message);
            // @ts-ignore
            dispatch({
              type: "VALIDATE_FIELD",
              field: "Email",
              isValid: false,
            });
          }
        }
      }
    } else {
      const result = onSubmit(email, password, usersList);

      if (result.isValid) {
        // @ts-ignore
        setLoggedInUser(result.user);
        navigate("/");
        emptyFields();
      } else {
        setEmailError(" ");
        setPasswordError(result.message);
      }

      // @ts-ignore
      dispatch({
        type: "SET_CREDENTIALS_VALIDITY",
        isValid: result.isValid,
      });
    }
  };

  const emptyFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const nameInput = (
    <Input
      type="text"
      id="name"
      name="name"
      placeholder="Enter your name..."
      autoComplete="name"
      label="Name"
      autoFocus={type === "register" && true}
      value={name}
      onChange={(e) => {
        handleFieldChange(e, "name", setName);
      }}
      errorMessage={nameError}
      isValidated={validationState.isNameValidated}
    />
  );

  let title, submitBtnText, bottomParagraph, formId, autoCompletePassword;

  if (type === "register" || type === "login") {
    title = type === "register" ? "Register" : "Login";

    submitBtnText = type === "register" ? "Register" : "Login";

    bottomParagraph =
      type === "register" ? (
        <p>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      ) : (
        <p>
          Don&apos;t have an account? <Link to="/register"> Register Here</Link>
        </p>
      );

    formId = type === "register" ? "register-form" : "login-form";
    autoCompletePassword =
      type === "register" ? "new-password" : "current-password";
  } else {
    title = null;
    submitBtnText = "Add";
    bottomParagraph = null;
    formId = "add-form";
    autoCompletePassword = "new-password";
  }

  const cardPosition = type === "add" ? "left" : "";

  return (
    <CardContainer position={cardPosition} type={type}>
      <h1 className="title text-center ">{title}</h1>

      <form
        id={formId}
        action="#"
        className="w-100"
        onSubmit={handleSubmit}
        noValidate
      >
        {(type === "register" || type === "add") && nameInput}

        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email..."
          autoComplete="email"
          label="Email"
          autoFocus={type === "login" && true}
          value={email}
          onChange={(e) => {
            handleFieldChange(e, "email", setEmail);
          }}
          errorMessage={emailError}
          isValidated={validationState.isEmailValidated}
        />

        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password..."
          autoComplete={autoCompletePassword}
          label="Password"
          autoFocus={false}
          value={password}
          onChange={(e) => {
            handleFieldChange(e, "password", setPassword);
          }}
          errorMessage={passwordError}
          isValidated={validationState.isPasswordValidated}
        />

        <button
          type="submit"
          className="btn border-2 border rounded-pill btn-outline-primary
          mt-3 mb-1 text-semibold"
          // disabled={!isValid}
        >
          {submitBtnText}
        </button>

        {bottomParagraph}
      </form>
    </CardContainer>
  );
}

LoginRegisterForm.propTypes = {
  onSubmit: PropTypes.func,
  type: PropTypes.string,
};

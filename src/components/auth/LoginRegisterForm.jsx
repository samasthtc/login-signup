import PropTypes from "prop-types";
import { useCallback, useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../../auth/authService";
import LoggedInUserContext from "../../context/loggedInUser/LoggedInUserContext";
import UsersListContext from "../../context/usersList/UsersListContext";
import debounce from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import Input from "../Input";

export default function LoginRegisterForm({ type, onSubmit }) {
  const navigate = useNavigate();

  const { usersList, setUsersList } = useContext(UsersListContext);
  const { setLoggedInUser } = useContext(LoggedInUserContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const initialValidationState = {
    isNameValidated: false,
    isNameValid: false,
    isEmailValidated: false,
    isEmailValid: false,
    isPasswordValidated: false,
    isPasswordValid: false,
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
        };
      default:
        return state;
    }
  }

  const [validationState, dispatch] = useReducer(
    validationReducer,
    initialValidationState
  );

  const allFieldsNotEmpty =
    (type !== "login" ? !!form.name : true) && !!form.email && !!form.password;
  const isValid =
    (type !== "login" ? validationState.isNameValid : true) &&
    validationState.isEmailValid &&
    validationState.isPasswordValid &&
    allFieldsNotEmpty;

  const handleFieldChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
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

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: isValid
        ? ""
        : type !== "login"
        ? errorMessage
        : field === "email"
        ? " "
        : field === "password"
        ? "Invalid credentials."
        : errorMessage,
    }));

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
      handleFieldValidation(form.name, "name");
      handleFieldValidation(form.email, "email");
      handleFieldValidation(form.password, "password");

      if (!isValid) return;

      if (isValid) {
        if (type === "register" || type === "add") {
          const result = onSubmit(form, usersList);
          if (result.isValid) {
            
            setUsersList(result.updatedList);
            type === "register" && navigate("/login");
            emptyFields();
          } else {
            setErrors({ ...errors, email: result.message });
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
      if (!allFieldsNotEmpty) return;

      const result = onSubmit(form, usersList);

      if (result.isValid) {
        
        setLoggedInUser(result.user);
        navigate("/");
        emptyFields();
      } else {
        setErrors({ ...errors, email: " ", password: result.message });
      }

      // @ts-ignore
      dispatch({
        type: "SET_CREDENTIALS_VALIDITY",
        isValid: result.isValid,
      });
    }
  };

  const emptyFields = () => {
    setForm({ name: "", email: "", password: "" });
    setErrors({ name: "", email: "", password: "" });
  };

  const nameInput = (
    <Input
      type="text"
      id="name"
      name="name"
      placeholder="Enter your name..."
      autoComplete="name"
      label="Name"
      autoFocus={type === "register"}
      value={form.name}
      onChange={(e) => {
        handleFieldChange(e, "name");
      }}
      errorMessage={errors.name}
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
          autoFocus={type === "login"}
          value={form.email}
          onChange={(e) => {
            handleFieldChange(e, "email");
          }}
          errorMessage={errors.email}
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
          value={form.password}
          onChange={(e) => {
            handleFieldChange(e, "password");
          }}
          errorMessage={errors.password}
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
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

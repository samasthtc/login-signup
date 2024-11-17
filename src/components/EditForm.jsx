import PropTypes from "prop-types";
import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
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
import EditableInput from "./inputFields/EditableInput";

export default function EditForm({ user, onSubmit }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: user.password,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

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
    validationState.isPasswordValid &&
    !!form.name &&
    !!form.email &&
    !!form.password;

  const handleFieldChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
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

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: isValid ? "" : errorMessage,
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
    handleFieldValidation(form.name, "name");
    handleFieldValidation(form.email, "email");
    handleFieldValidation(form.password, "password");

    if (!isValid) return;

    const result = onSubmit(user.id, form, usersList);

    if (result.isValid) {
      // @ts-ignore
      setUsersList(result.updatedList);
    }
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }
  }, [user]);

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
          name="name"
          autoComplete="off"
          value={form.name}
          onChange={(e) => {
            handleFieldChange(e, "name");
          }}
          errorMessage={errors.name}
          isValidated={validationState.isNameValidated}
        />

        <EditableInput
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => {
            handleFieldChange(e, "email");
          }}
          errorMessage={errors.email}
          isValidated={validationState.isEmailValidated}
        />

        <EditableInput
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => {
            handleFieldChange(e, "password");
          }}
          errorMessage={errors.password}
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
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.any.isRequired,
    email: PropTypes.any.isRequired,
    name: PropTypes.any.isRequired,
    password: PropTypes.any.isRequired,
  }).isRequired,
};

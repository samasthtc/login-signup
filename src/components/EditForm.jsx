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
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";
import UsersListContext from "../context/usersList/UsersListContext";
import debounce from "../utils/useDebounce";
import CardContainer from "./common/CardContainer";
import EditableInput from "./inputFields/EditableInput";

export default function EditForm({ userId, isCurrent, onSubmit }) {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const { usersList, setUsersList } = useContext(UsersListContext);
  const [user, setUser] = useState(() => {
    if (isCurrent === "true") {
      return { ...loggedInUser };
    } else {
      const foundUser = usersList.find((u) => u.id === Number(userId));
      return foundUser ? { ...foundUser } : null;
    }
  });
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: user.password,
    changed: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [editingState, setEditingState] = useState({
    name: false,
    email: false,
    password: false,
  });

  const initialValidationState = {
    isNameValidated: true,
    isNameValid: true,
    isEmailValidated: true,
    isEmailValid: true,
    isPasswordValidated: true,
    isPasswordValid: true,
  };

  useEffect(() => {
    if (isCurrent === "true") {
      setUser({ ...loggedInUser });
    } else {
      const foundUser = usersList.find((u) => u.id === Number(userId));
      setUser(foundUser ? { ...foundUser } : null);
    }
  }, [isCurrent, loggedInUser, userId, usersList]);

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
    setForm({ ...form, [field]: e.target.value, changed: true });
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
    if (form.changed) {
      handleFieldValidation(form.name, "name");
      handleFieldValidation(form.email, "email");
      handleFieldValidation(form.password, "password");

      if (!isValid) return;

      const result = onSubmit(user.id, form, usersList);
      if (result.isValid) {
        // @ts-ignore
        setUsersList(result.updatedList);
        setEditingState({
          name: false,
          email: false,
          password: false,
        });
        setForm({ ...form, changed: false });
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
          name="name"
          autoComplete="off"
          value={form.name}
          onChange={(e) => {
            handleFieldChange(e, "name");
          }}
          errorMessage={errors.name}
          isValidated={validationState.isNameValidated}
          editingState={editingState.name}
          setEditingState={setEditingState}
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
          editingState={editingState.email}
          setEditingState={setEditingState}
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
          editingState={editingState.password}
          setEditingState={setEditingState}
        />

        <button
          type="submit"
          className="btn border-2 rounded-pill btn-outline-primary
           mt-3 mb-1 text-semibold me-2"
          disabled={!form.changed}
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
  isCurrent: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  // user: PropTypes.shape({
  //   id: PropTypes.any.isRequired,
  //   email: PropTypes.any.isRequired,
  //   name: PropTypes.any.isRequired,
  //   password: PropTypes.any.isRequired,
  // }).isRequired,
  userId: PropTypes.any,
};

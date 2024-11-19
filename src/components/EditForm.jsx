import PropTypes from "prop-types";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../auth/authService";
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";
import UsersListContext from "../context/usersList/UsersListContext";
import { default as useDebounce } from "../utils/debounce";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleEditingState = (value, field) =>
    setEditingState({ ...editingState, [field]: value });

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

  const debouncedValidation = useDebounce((value, field) =>
    handleFieldValidation(value, field)
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
      setEditingState({
        name: false,
        email: false,
        password: false,
      });
      setForm({ ...form, changed: false });

      setSuccessMessage("Profile updated successfully!");
      setShowAlert(true);
      setTimeout(() => {
        setSuccessMessage("");
        setShowAlert(false);
      }, 3000);
    }
  };

  const tooltipRef = useRef();

  useEffect(() => {
    let tooltipInstance;
    let hideTimeout;

    const showTooltip = () => {
      if (tooltipRef.current && !form.changed) {
        tooltipInstance = new window.bootstrap.Tooltip(tooltipRef.current, {
          title: "No changes were made",
          placement: "bottom",
          trigger: "manual",
          container: "body",
        });
        tooltipInstance.show();

        hideTimeout = setTimeout(() => {
          tooltipInstance.hide();
        }, 1000);
      }
    };

    const hideTooltip = () => {
      if (tooltipInstance) {
        tooltipInstance.hide();
      }
      clearTimeout(hideTimeout);
    };

    const currentTooltipRef = tooltipRef.current;

    if (currentTooltipRef) {
      // @ts-ignore
      currentTooltipRef.addEventListener("mouseenter", showTooltip);
      // @ts-ignore
      currentTooltipRef.addEventListener("mouseleave", hideTooltip);
    }

    return () => {
      if (currentTooltipRef) {
        // @ts-ignore
        currentTooltipRef.removeEventListener("mouseenter", showTooltip);
        // @ts-ignore
        currentTooltipRef.removeEventListener("mouseleave", hideTooltip);
      }
      tooltipInstance?.dispose();
    };
  }, [form.changed]);

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
          setEditingState={handleEditingState}
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
          setEditingState={handleEditingState}
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
          setEditingState={handleEditingState}
        />

        <div
          className="position-relative d-inline-block"
          ref={!form.changed ? tooltipRef : null}
          data-bs-toggle={!form.changed ? tooltipRef : null}
        >
          <button
            type="submit"
            className="btn border-2 rounded-pill btn-outline-primary
             mt-3 mb-1 text-semibold me-2"
            disabled={!form.changed}
          >
            Save Changes
          </button>
        </div>

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

      {showAlert && (
        <div
          className={"alert alert-success text-center fade-in-out"}
          role="alert"
          onAnimationEnd={() => {
            setShowAlert(false);
          }}
        >
          {successMessage}
        </div>
      )}
    </CardContainer>
  );
}

EditForm.propTypes = {
  isCurrent: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userId: PropTypes.any.isRequired,
};

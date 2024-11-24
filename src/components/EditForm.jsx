import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../auth/AuthService";
import { UsersListContext } from "../context/usersList/UsersListProvider";
import { useDebouncePromise } from "../utils/debounce";
import CardContainer from "./common/CardContainer";
import LoadingSpinner from "./common/LoadingSpinner";
import EditableInput from "./inputFields/EditableInput";

export default function EditForm({ userId, isCurrent, submit }) {
  const { loggedInUser, login } = useAuth();
  const { usersList, setUsersList } = useContext(UsersListContext);
  const [user, setUser] = useState(() => {
    if (isCurrent === "true") {
      return { ...loggedInUser };
    } else {
      const foundUser = usersList.find((u) => u.id === Number(userId));
      return foundUser ? { ...foundUser } : null;
    }
  });
  const [manualDirtyFields, setManualDirtyFields] = useState({});

  const defaults = {
    name: user?.name || "",
    email: user?.email || "",
    password: user?.password || "",
  };

  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: defaults,
    mode: "onChange",
  });

  const [alert, setAlert] = useState({
    show: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (isCurrent === "true") {
      setUser({ ...loggedInUser });
    } else {
      const foundUser = usersList.find((u) => u.id === Number(userId));
      setUser(foundUser ? { ...foundUser } : null);
    }
  }, [isCurrent, loggedInUser, userId, usersList]);

  const handleFieldValidation = (field, value) => {
    const { isValid, errorMessage } = validateField(
      value,
      field === "name"
        ? validateName
        : field === "email"
        ? validateEmail
        : validatePassword
    );

    if (!manualDirtyFields[field]) {
      setManualDirtyFields((prev) => ({ ...prev, [field]: true }));
    } else {
      for (const field in manualDirtyFields) {
        if (!dirtyFields[field]) {
          setManualDirtyFields((prev) => {
            const newState = { ...prev };
            delete newState[field];
            return newState;
          });
        }
      }
    }

    return isValid || errorMessage || true;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    setValue(field, value, { shouldDirty: true });
    return await debouncedValidation(field, value);
  };

  const onSubmit = (data) => {
    try {
      const result = submit(user.id, data, usersList);

      if (result.isValid) {
        isCurrent === "true" && login(result.updatedUser);
        setUsersList(result.updatedList);
        setAlert({
          show: true,
          success: true,
          message: "Profile updated successfully!",
        });
        reset(data, { keepDirty: false });
        setManualDirtyFields({});
      } else {
        setAlert({
          show: true,
          success: false,
          message: result.message ?? "An error occured! Profile update failed!",
        });
      }
      setTimeout(() => {
        setAlert({ show: false, success: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        success: false,
        message: "An error occured! Profile update failed!",
      });
      setTimeout(() => {
        setAlert({ show: false, success: false, message: "" });
      }, 3000);
    }
  };

  const noChanges = Object.keys(manualDirtyFields).length <= 0;

  const tooltipRef = useRef();

  useEffect(() => {
    let tooltipInstance;
    let hideTimeout;

    const showTooltip = () => {
      if (tooltipRef.current && noChanges) {
        tooltipInstance = new window.bootstrap.Tooltip(tooltipRef.current, {
          title: "No changes were made",
          placement: "bottom",
          trigger: "manual",
          container: "body",
        });
        tooltipInstance.show();

        hideTimeout = setTimeout(() => {
          tooltipInstance?.hide();
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
  }, [formState, noChanges]);

  useEffect(() => {
    reset(defaults);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return (
    <CardContainer>
      <h1 className="title text-center ">Edit Profile</h1>

      <form
        id="edit-form"
        action="#"
        className=" w-100"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <EditableInput
          type="text"
          name="name"
          autoComplete="off"
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: async (value) =>
                await validateFieldWithDebounce("name", value),
            },
          }}
          errorMessage={errors.name?.message}
          isDirty={manualDirtyFields["name"] ?? false}
        />

        <EditableInput
          type="email"
          name="email"
          autoComplete="email"
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: (value) => validateFieldWithDebounce("email", value),
            },
          }}
          errorMessage={errors.email?.message}
          isDirty={manualDirtyFields["email"] ?? false}
        />

        <EditableInput
          type="password"
          name="password"
          autoComplete="new-password"
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: (value) => validateFieldWithDebounce("password", value),
            },
          }}
          errorMessage={errors.password?.message}
          isDirty={manualDirtyFields["password"] ?? false}
        />

        <div
          className="position-relative d-inline-block"
          ref={noChanges ? tooltipRef : null}
          data-bs-toggle={noChanges ? tooltipRef : null}
        >
          <button
            type="submit"
            className="btn border-2 rounded-pill btn-outline-primary
             mt-3 mb-1 text-semibold me-2"
            disabled={noChanges}
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

      {isSubmitting && (
        <div className="col-12 text-center">
          <LoadingSpinner />
        </div>
      )}

      {alert.show && (
        <div
          className={`alert ${
            alert.success ? "alert-success" : "alert-danger"
          } text-center fade-in-out`}
          role="alert"
          onAnimationEnd={() => {
            setAlert({ show: false, success: false, message: "" });
          }}
        >
          {alert.message}
        </div>
      )}
    </CardContainer>
  );
}

EditForm.propTypes = {
  isCurrent: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  userId: PropTypes.any.isRequired,
};

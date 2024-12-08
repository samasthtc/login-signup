import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/AuthProvider";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../../auth/AuthService";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import { useDebouncePromise } from "../../utils/debounce";
import LoadingSpinner from "../common/LoadingSpinner";
import Input from "../inputFields/Input";

export default function UserEditForm({
  user,
  isCurrent,
  handleGoBack,
  submit,
  toggleEditPassword,
}) {
  const { login, setTriggerFetch } = useAuth();
  const { usersList, setUsersList } = useContext(UsersListContext);

  let defaults = useRef({
    name: user?.name || "",
    email: user?.email || "",
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: defaults.current,
    mode: "onChange",
  });

  useEffect(() => {
    defaults.current = {
      name: user?.name || "",
      email: user?.email || "",
    };
    reset(defaults.current);
  }, [user, reset]);

  const [manualDirtyFields, setManualDirtyFields] = useState({});

  const [alert, setAlert] = useState({
    show: false,
    success: false,
    message: "",
  });

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
      if (!dirtyFields[field]) {
        setManualDirtyFields((prev) => {
          const newState = { ...prev };
          delete newState[field];
          return newState;
        });
      }
    }

    return isValid || errorMessage || true;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    // setValue(field, value, { shouldDirty: true });
    return await debouncedValidation(field, value);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    try {
      let success, resData, message;
      try {
        ({ success, data: resData, message } = await submit(user._id, data));
      } catch (error) {
        message = error.message || "An error occured!";
        success = false;
      }

      if (success) {
        const newUser = resData;
        isCurrent === "true" && login(newUser);
        setUsersList([...usersList, newUser]);
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
          message: message ?? "An error occured! Profile update failed!",
        });
      }

      setTriggerFetch(true);
    } catch (error) {
      console.error(error);
      // setAlert({
      //   show: true,
      //   success: false,
      //   message: "An error occured! Profile update failed!",
      // });
    }

    alert.show &&
      setTimeout(() => {
        setAlert({ show: false, success: false, message: "" });
      }, 3000);
  };

  const noChanges = Object.keys(manualDirtyFields).length < 1;

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

  const fieldNames = ["name", "email"];
  const inputs = fieldNames.map((field) => (
    <Input
      key={field}
      type={field === "name" ? "text" : field}
      name={field}
      autoComplete={field === "email" ? "email" : "off"}
      registerProps={{
        register: register,
        options: {
          required: "This field is required",
          validate: (value) => validateFieldWithDebounce(field, value),
        },
      }}
      errorMessage={errors[field]?.message}
      isDirty={manualDirtyFields[field] ?? false}
      showSuccess={true}
    />
  ));

  return (
    <>
      <h1 className="title text-center ">Edit Profile</h1>
      <form
        id="edit-form"
        action="#"
        className=" w-100"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {inputs}

        <p className="mt-2 ms-1 text-capitalize">
          <strong className="me-2">Role:</strong>
          {user.role}
        </p>

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

        <button
          type="submit"
          className="btn border-2 rounded-pill btn-outline-danger
       mt-3 mb-1 text-semibold me-2"
          onClick={toggleEditPassword}
        >
          Change Password
        </button>

        <button
          type="button"
          className="btn border-2 rounded-pill btn-outline-secondary mt-3 mb-1
          text-semibold text-black-50"
          onClick={handleGoBack}
        >
          Back
        </button>
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
    </>
  );
}

UserEditForm.propTypes = {
  handleGoBack: PropTypes.any,
  isCurrent: PropTypes.string,
  login: PropTypes.func,
  setUsersList: PropTypes.func,
  submit: PropTypes.func,
  toggleEditPassword: PropTypes.any,
  user: PropTypes.shape({
    email: PropTypes.string,
    _id: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
  }),
  usersList: PropTypes.any,
};

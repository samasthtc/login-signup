import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../auth/AuthProvider";
import { validatePassword } from "../../auth/AuthService";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import { useDebouncePromise } from "../../utils/debounce";
import LoadingSpinner from "../common/LoadingSpinner";
import Input from "../inputFields/Input";

export default function PasswordEditForm({
  user,
  isCurrent,
  handleGoBack,
  submit,
  toggleEditPassword,
}) {
  const { login, setTriggerFetch } = useAuth();
  const { usersList, setUsersList } = useContext(UsersListContext);

  const defaults = {
    "Old Password": "",
    "New Password": "",
    "Confirm Password": "",
  };

  const {
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaults,
    mode: "onChange",
  });
  const [manualDirtyFields, setManualDirtyFields] = useState({});
  const allFieldsDirty =
    getValues("Old Password").length !== 0 &&
    getValues("New Password").length !== 0 &&
    getValues("Confirm Password").length !== 0;

  const [alert, setAlert] = useState({
    show: false,
    success: false,
    message: "",
  });

  const handleManualDirtyFields = (field, value) => {
    if (!manualDirtyFields[field]) {
      setManualDirtyFields((prev) => ({ ...prev, [field]: true }));
    } else if (value === defaults[field]) {
      setManualDirtyFields((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  const handleFieldValidation = (field, value) => {
    const { isValid, errorMessage } = validatePassword(value);
    return isValid || errorMessage || true;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    return await debouncedValidation(field, value);
  };

  const validateConfirmPassword = (value) => {
    const isValid = getValues("New Password") === value;
    return isValid || "Passwords do not match";
  };

  const onSubmit = async (data) => {
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
          message: "Password updated successfully!",
        });
        reset(data, { keepDirty: false });
        setManualDirtyFields({});
      } else {
        setAlert({
          show: true,
          success: false,
          message: message ?? "An error occured! Password update failed!",
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

  const noChanges = !allFieldsDirty;

  const tooltipRef = useRef();

  useEffect(() => {
    let tooltipInstance;
    let hideTimeout;

    const showTooltip = () => {
      if (tooltipRef.current && noChanges) {
        tooltipInstance = new window.bootstrap.Tooltip(tooltipRef.current, {
          title: "All fields must be filled",
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
  }, [reset, user]);

  const inputs = (
    <>
      <Input
        type="password"
        name="Old Password"
        registerProps={{
          register: register,
          options: {
            required: "This field is required",
            onchange: (e) =>
              handleManualDirtyFields("oldPassword", e.target.value),
          },
        }}
        errorMessage={errors["Old Password"]?.message}
        isDirty={getValues("Old Password") !== defaults["Old Password"]}
      />
      <Input
        type="password"
        name="New Password"
        registerProps={{
          register: register,
          options: {
            required: "This field is required",
            validate: async (value) =>
              await validateFieldWithDebounce("newPassword", value),
            onChange: (e) =>
              handleManualDirtyFields("newPassword", e.target.value),
          },
        }}
        errorMessage={errors["New Password"]?.message}
        isDirty={getValues("New Password") !== defaults["New Password"]}
      />
      <Input
        type="password"
        name="Confirm Password"
        registerProps={{
          register: register,
          options: {
            required: "This field is required",
            validate: (value) => validateConfirmPassword(value),
            onchange: (e) =>
              handleManualDirtyFields("confirmPassword", e.target.value),
          },
        }}
        errorMessage={errors["Confirm Password"]?.message}
        isDirty={getValues("Confirm Password") !== defaults["Confirm Password"]}
      />
    </>
  );

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
          Change User Info
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

PasswordEditForm.propTypes = {
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
  }),
  usersList: PropTypes.any,
};

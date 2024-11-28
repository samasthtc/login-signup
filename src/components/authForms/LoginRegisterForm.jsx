import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../../auth/AuthService";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import { useDebouncePromise } from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import Input from "../inputFields/Input";

export default function LoginRegisterForm({ type, submit }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    show: false,
    success: false,
    message: "",
  });

  const defaults = {
    name: "",
    email: "",
    password: "",
  };
  type === "login" && delete defaults.name;

  const {
    register,
    handleSubmit,
    formState,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
  } = useForm({
    defaultValues: defaults,
    mode: "onChange",
  });
  const [manualDirtyFields, setManualDirtyFields] = useState({});

  const resetFields = () => {
    reset(defaults);
    setManualDirtyFields({});
  };

  const handleDirtyFields = (field, value) => {
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
    const { isValid, errorMessage } = validateField(
      value,
      field === "name"
        ? validateName
        : field === "email"
        ? validateEmail
        : validatePassword
    );
    handleDirtyFields(field, value);
    return isValid || errorMessage;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    if (type === "login") {
      handleDirtyFields(field, value);
      return;
    }

    return await debouncedValidation(field, value).then((result) => result);
  };

  const onSubmit = (data) => {
    let isEmpty = false;
    for (const field in data) {
      if (!data[field] || data[field] === defaults[field]) {
        // @ts-ignore
        setError(field, {
          type: "manual",
          message: "This field is required",
        });
        isEmpty = true;
      }
    }
    if (isEmpty) return;

    const result = submit(data, usersList);

    if (result.isValid) {
      if (type === "register" || type === "add") {
        setUsersList(result.updatedList);
        type === "register" && navigate("/login");
        if (type === "add") {
          resetFields();
          setAlert({
            show: true,
            success: true,
            message: result.message,
          });
        }
      } else if (type === "login") {
        login(result.user);
        // navigate("/");
      }
    } else {
      setError(
        "email",
        {
          type: "manual",
          message: type === "register" || type === "add" ? result.message : " ",
        },
        { shouldFocus: true }
      );
      type === "login" &&
        setError("password", { type: "manual", message: result.message });
      setAlert({
        show: true,
        success: false,
        message: result.message ?? "An error occured!",
      });
    }

    alert.show &&
      setTimeout(() => {
        setAlert({ show: false, success: false, message: "" });
      }, 3000);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, reset, isSubmitSuccessful, type]);

  const nameInput = (
    <Input
      type="text"
      name="name"
      autoFocus={true}
      my={0}

      registerProps={{
        register: register,
        options: {
          validate: async (value) =>
            await validateFieldWithDebounce("name", value),
        },
      }}
      errorMessage={errors.name?.message}
      isDirty={manualDirtyFields["name"] ?? false}
      showSuccess={type !== "login"}
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

  const fieldNames = ["email", "password"];
  const inputs = fieldNames.map((field) => (
    <Input
      key={field}
      type={field}
      name={field}
      autoComplete={
        field === "email"
          ? "email"
          : field === "password"
          ? autoCompletePassword
          : "off"
      }
      autoFocus={type === "login" && field === "email"}
      registerProps={{
        register: register,
        options: {
          validate: (value) =>
            type === "login"
              ? handleDirtyFields(field, value)
              : validateFieldWithDebounce(field, value),
        },
      }}
      errorMessage={errors[field]?.message}
      isDirty={manualDirtyFields[field] ?? false}
      showSuccess={type !== "login"}
    />
  ));

  return (
    <CardContainer position={cardPosition} type={type}>
      <h1 className="title text-center ">{title}</h1>

      <form
        id={formId}
        action="#"
        className="w-100 d-flex justify-content-center 
          flex-column"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {(type === "register" || type === "add") && nameInput}

        {inputs}

        <button
          type="submit"
          className="btn btn-submit-primary border-2 border border-primary rounded-pill btn-outline-primary
          mt-3 mb-1 fw-bold align-self-end bg-primary-subtle hover-bg-primary w-100"
          // disabled={!isValid}
        >
          {submitBtnText}
        </button>

        {bottomParagraph}
      </form>

      {isSubmitting && (
        <div className="col-12 text-center mt-2">
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

LoginRegisterForm.propTypes = {
  submit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

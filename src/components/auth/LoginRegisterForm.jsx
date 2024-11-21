import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../../auth/authService";
import LoggedInUserContext from "../../context/loggedInUser/LoggedInUserContext";
import UsersListContext from "../../context/usersList/UsersListContext";
import { useDebouncePromise } from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import Input from "../inputFields/Input";

export default function LoginRegisterForm({ type, submit }) {
  const navigate = useNavigate();
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { setLoggedInUser } = useContext(LoggedInUserContext);
  const [manualDirtyFields, setManualDirtyFields] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
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
    }

    return isValid || errorMessage || true;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    return await debouncedValidation(field, value).then((result) => result);
  };

  const onSubmit = (data) => {
    const result = submit(data, usersList);

    if (result.isValid) {
      if (type === "register" || type === "add") {
        setUsersList(result.updatedList);
        type === "register" && navigate("/login");
        // emptyFields();
      } else if (type === "login") {
        setLoggedInUser(result.user);
        navigate("/");
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
    }
  };

  const nameInput = (
    <Input
      type="text"
      name="name"
      autoFocus={true}
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
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {(type === "register" || type === "add") && nameInput}

        <Input
          type="email"
          name="email"
          autoComplete="email"
          autoFocus={type === "login"}
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: (value) =>
                type === "login"
                  ? true
                  : validateFieldWithDebounce("email", value),
            },
          }}
          errorMessage={errors.email?.message}
          isDirty={
            type === "login" ? false : manualDirtyFields["email"] ?? false
          }
        />

        <Input
          type="password"
          name="password"
          autoComplete={autoCompletePassword}
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: (value) =>
                type === "login"
                  ? true
                  : validateFieldWithDebounce("password", value),
            },
          }}
          errorMessage={errors.password?.message}
          isDirty={
            type === "login" ? false : manualDirtyFields["password"] ?? false
          }
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

      {isSubmitting && (
        <div className="col-12 text-center">
          <LoadingSpinner />
        </div>
      )}
    </CardContainer>
  );
}

LoginRegisterForm.propTypes = {
  submit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

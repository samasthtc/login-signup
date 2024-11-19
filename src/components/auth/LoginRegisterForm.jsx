import PropTypes from "prop-types";
import { useContext } from "react";
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
import Input from "../inputFields/Input";

export default function LoginRegisterForm({ type, submit }) {
  const navigate = useNavigate();
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { setLoggedInUser } = useContext(LoggedInUserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // const onSubmit = (data) => console.log(data);

  const handleFieldValidation = (field, value) => {
    const { isValid, errorMessage } = validateField(
      value,
      field === "name"
        ? validateName
        : field === "email"
        ? validateEmail
        : validatePassword
    );
    return isValid || errorMessage || true;
  };

  const debouncedValidation = useDebouncePromise(handleFieldValidation);

  const validateFieldWithDebounce = async (field, value) => {
    return debouncedValidation(field, value).then((result) => result);
  };

  // const [form, setForm] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  // const [errors, setErrors] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });

  // const initialValidationState = {
  //   isNameValidated: false,
  //   isNameValid: false,
  //   isEmailValidated: false,
  //   isEmailValid: false,
  //   isPasswordValidated: false,
  //   isPasswordValid: false,
  // };

  // function validationReducer(state, action) {
  //   switch (action.type) {
  //     case "VALIDATE_FIELD":
  //       return {
  //         ...state,
  //         [`is${action.field}Validated`]: true,
  //         [`is${action.field}Valid`]: action.isValid,
  //       };
  //     case "SET_CREDENTIALS_VALIDITY":
  //       return {
  //         ...state,
  //         isEmailValidated: true,
  //         isEmailValid: action.isValid,
  //         isPasswordValidated: true,
  //         isPasswordValid: action.isValid,
  //       };
  //     default:
  //       return state;
  //   }
  // }

  // const [validationState, dispatch] = useReducer(
  //   validationReducer,
  //   initialValidationState
  // );

  // const allFieldsNotEmpty =
  //   (type !== "login" ? !!form.name : true) && !!form.email && !!form.password;
  // const isValid =
  //   (type !== "login" ? validationState.isNameValid : true) &&
  //   validationState.isEmailValid &&
  //   validationState.isPasswordValid &&
  //   allFieldsNotEmpty;

  // const handleFieldChange = (e, field) => {
  //   setForm({ ...form, [field]: e.target.value });
  //   !(type === "login") &&
  //     debouncedValidation?.debouncedCallback(e.target.value, field);
  // };

  // const handleFieldValidation = (value, field) => {
  //   const { isValid, errorMessage } = validateField(
  //     value,
  //     field === "name"
  //       ? validateName
  //       : field === "email"
  //       ? validateEmail
  //       : validatePassword
  //   );

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [field]: isValid
  //       ? ""
  //       : type !== "login"
  //       ? errorMessage
  //       : field === "email"
  //       ? " "
  //       : field === "password"
  //       ? "Invalid credentials."
  //       : errorMessage,
  //   }));

  //   // @ts-ignore
  //   dispatch({
  //     type: "VALIDATE_FIELD",
  //     field: field.charAt(0).toUpperCase() + field.slice(1),
  //     isValid,
  //   });
  // };

  // const debouncedValidation = useDebounce((value, field) =>
  //   handleFieldValidation(value, field)
  // );

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   if (type !== "login") {
  //     handleFieldValidation(form.name, "name");
  //     handleFieldValidation(form.email, "email");
  //     handleFieldValidation(form.password, "password");

  //     if (!isValid) return;

  //     if (isValid) {
  //       if (type === "register" || type === "add") {
  //         const result = onSubmit(form, usersList);
  //         if (result.isValid) {
  //           setUsersList(result.updatedList);
  //           type === "register" && navigate("/login");
  //           emptyFields();
  //         } else {
  //           setErrors({ ...errors, email: result.message });
  //           // @ts-ignore
  //           dispatch({
  //             type: "VALIDATE_FIELD",
  //             field: "Email",
  //             isValid: false,
  //           });
  //         }
  //       }
  //     }
  //   } else {
  //     if (!allFieldsNotEmpty) return;

  //     const result = submit(form, usersList);

  //     if (result.isValid) {
  //       setLoggedInUser(result.user);
  //       navigate("/");
  //     } else {
  //       setErrors({ ...errors, email: " ", password: result.message });
  //     }

  //     // @ts-ignore
  //     dispatch({
  //       type: "SET_CREDENTIALS_VALIDITY",
  //       isValid: result.isValid,
  //     });
  //   }
  // };

  const onSubmit = (data) => {
    // TODO: Add indicator that form is submitting
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
    }
  };

  // const emptyFields = () => {
  //   setForm({ name: "", email: "", password: "" });
  //   setErrors({ name: "", email: "", password: "" });
  // };

  const nameInput = (
    <Input
      type="text"
      name="name"
      autoFocus={true}
      registerProps={{
        register: register,
        options: {
          required: "This field is required",
          validate: (value) => validateFieldWithDebounce("name", value),
        },
      }}
      errorMessage={errors.name?.message}
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
              validate: (value) => validateFieldWithDebounce("email", value),
            },
          }}
          errorMessage={errors.email?.message}
        />

        <Input
          type="password"
          name="password"
          autoComplete={autoCompletePassword}
          registerProps={{
            register: register,
            options: {
              required: "This field is required",
              validate: (value) => validateFieldWithDebounce("password", value),
            },
          }}
          errorMessage={errors.password?.message}
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
  submit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

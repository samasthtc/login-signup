import CardContainer from "@/components/common/CardContainer";
import Input from "@/components/inputFields/Input";
import { useForm } from "react-hook-form";
import {
  validateEmail,
  validateField,
  validateName,
  validatePassword,
} from "../auth/authService";
import { useDebouncePromise } from "../utils/debounce";

export default function ReactHForm() {
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

  const onSubmit = (data) => console.log(data);

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

  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <CardContainer type="register">
        <h1 className="title text-center ">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

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

          <Input
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
          />

          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            registerProps={{
              register: register,
              options: {
                required: "This field is required",
                validate: (value) =>
                  validateFieldWithDebounce("password", value),
              },
            }}
            errorMessage={errors.password?.message}
          />

          <button type="submit">Submit</button>
        </form>
      </CardContainer>
    </main>
  );
}

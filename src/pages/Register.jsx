import LoginRegisterForm from "@/components/auth/LoginRegisterForm";
import { register } from "../auth/authService";

export default function Register() {
  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <LoginRegisterForm type="register" submit={register} />
    </main>
  );
}

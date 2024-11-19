import LoginRegisterForm from "@/components/auth/LoginRegisterForm";
import { login } from "../auth/authService";

export default function Login() {
  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <LoginRegisterForm type="login" submit={login} />
    </main>
  );
}

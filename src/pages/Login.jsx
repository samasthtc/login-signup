import LoginRegisterForm from "@/components/authForms/LoginRegisterForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { login } from "../auth/AuthService";

export default function Login() {
  const { loggedInUser } = useAuth();

  if (loggedInUser) {
    return <Navigate to="/" />;
  }

  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <LoginRegisterForm type="login" submit={login} />
    </main>
  );
}

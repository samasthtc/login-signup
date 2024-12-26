import LoginRegisterForm from "@/components/authForms/LoginRegisterForm";
import { Navigate } from "react-router-dom";
import { login } from "../api/api";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { loggedInUser } = useAuth();

  if (loggedInUser) {
    const path = loggedInUser.role === "admin" ? "/users" : "/welcome";
    return <Navigate to={path} />;
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

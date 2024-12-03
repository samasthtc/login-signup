import LoginRegisterForm from "@/components/authForms/LoginRegisterForm";
import { Navigate } from "react-router-dom";
import { register } from "../api/api";
import { useAuth } from "../auth/AuthProvider";

export default function Register() {
  const { loggedInUser } = useAuth();

  if (loggedInUser) {
    return <Navigate to="/" />;
  }

  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <LoginRegisterForm type="register" submit={register} />
    </main>
  );
}

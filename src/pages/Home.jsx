import LoginRegisterForm from "@/components/auth/LoginRegisterForm";
import UsersTable from "@/components/users/UsersTable";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth/authService";
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";

export default function Home() {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      localStorage.setItem("loggedIn", "false");
      navigate("/login");
    }
  }, [loggedInUser]);

  return (
    <main className="container-fluid mt-2 mt-md-5 mb-3">
      <div
        className="row mx-md-4 mx-lg-5 mx-auto g-md-5 g-3
         rounded-5 border border-primary border-2 
          pb-md-5 pb-3 px-md-0 px-3"
      >
        <LoginRegisterForm type="add" onSubmit={register} />
        <UsersTable />
      </div>
    </main>
  );
}

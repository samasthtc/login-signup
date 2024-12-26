import LoginRegisterForm from "@/components/authForms/LoginRegisterForm";
import Modal from "@/components/common/Modal";
import UsersTable from "@/components/users/UsersTable";
import { Navigate } from "react-router-dom";
import { register } from "../api/api";
import { useAuth } from "../auth/AuthProvider";

export default function Users() {
  const { loggedInUser } = useAuth();

  if (loggedInUser?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <main
      className="container-fluid
    d-flex justify-content-center align-items-center h-100"
    >
      <div
        className="row mx-md-4 mx-lg-5 mx-auto 
         rounded-5 border border-accent-shadow border-2 overflow-hidden 
           pb-3 px-md-0 flex-grow-1 bg-2"
      >
        <Modal
          id="add-usr-modal"
          title="Add User"
          body={<LoginRegisterForm type="add" submit={register} />}
          confirmText="Add"
          cancelText="Cancel"
          onConfirm={register}
        />
        <UsersTable />
        <div className="d-flex justify-content-end">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={`#add-usr-modal`}
            className="btn  btn-lg 
          rounded-circle mt-4 me-2 floating-btn"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </main>
  );
}

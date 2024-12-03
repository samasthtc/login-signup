import LoginRegisterForm from "@/components/authForms/LoginRegisterForm";
import Modal from "@/components/common/Modal";
import UsersTable from "@/components/users/UsersTable";
import { register } from "../api/api";

export default function Home() {
  return (
    <main
      className="container-fluid
    d-flex justify-content-center align-items-center vh-100"
    >
      <Modal
        id="add-usr-modal"
        title="Add User"
        body={<LoginRegisterForm type="add" submit={register} />}
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={register}
      />
      <div
        className="row mx-md-4 mx-lg-5 mx-auto 
         rounded-5 border border-primary border-2 
           pb-3 px-md-0 flex-grow-1"
      >
        <UsersTable />
      </div>

      <div className="">
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#add-usr-modal`}
          className="btn btn-primary btn-lg position-absolute bottom-0 end-0 
          rounded-circle m-4 floating-btn"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </main>
  );
}

import LoginRegisterForm from "@/components/auth/LoginRegisterForm";
import UsersTable from "@/components/users/UsersTable";
import { register } from "../auth/authService";

export default function Home() {
  return (
    <main className="container-fluid mt-2 mt-md-5 mb-3">
      <div
        className="row mx-md-4 mx-lg-5 mx-auto g-md-5 g-3
         rounded-5 border border-primary border-2 
          pb-md-5 pb-3 px-md-0 px-3"
      >
        <LoginRegisterForm type="add" onSubmit={register} />
        <div className="vr-hr border-2 border border-primary rounded col-12"></div>
        <UsersTable />
      </div>
    </main>
  );
}

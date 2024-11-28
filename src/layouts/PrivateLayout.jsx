import Sidebar from "@/components/common/Sidebar";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function PrivateLayout({ children }) {
  const { loggedInUser } = useAuth();

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="col-auto m-0 p-0 ">
        <Sidebar />
      </div>
      {/* <Navbar /> */}
      <div className="col m-0 p-0">{children}</div>
    </>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
};

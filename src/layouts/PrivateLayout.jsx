import Sidebar from "@/components/common/Sidebar";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PrivateLayout({ children }) {
  const { loggedInUser, token, isLoading } = useAuth();

  if (!isLoading) {
    if (!loggedInUser || !token) {
      return <Navigate to="/login" replace />;
    }

    return (
      <>
        <Sidebar />
        {/* <Navbar /> */}
        <div className="col m-0 p-0">{children}</div>
      </>
    );
  }
  else {
    return <div
    className="d-flex justify-content-center align-items-center my-auto"
    style={{ height: "90vh" }}
  >
    <LoadingSpinner />
  </div>;
  }
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
};

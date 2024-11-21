import Navbar from "@/components/common/Navbar";
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
      <Navbar />
      {children}
    </>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
};

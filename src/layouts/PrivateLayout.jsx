import Navbar from "@/components/common/Navbar";
import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";

export default function PrivateLayout({ children }) {
  const { loggedInUser } = useContext(LoggedInUserContext);

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

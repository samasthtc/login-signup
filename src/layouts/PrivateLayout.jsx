import PropTypes from "prop-types"
import Navbar from "@/components/common/Navbar";
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

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
  children: PropTypes.any
}

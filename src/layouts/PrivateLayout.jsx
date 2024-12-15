import LoadingSpinner from "@/components/common/LoadingSpinner";
import Sidebar from "@/components/common/Sidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { debounce } from "../utils/debounce";

export default function PrivateLayout({ children }) {
  const { loggedInUser, token, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerWidth < 576);
  const isOpenAndSmall = isOpen && isSmall;

  useEffect(() => {
    const handleResize = debounce(
      () => setIsSmall(window.innerWidth < 576),
      150
    );
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isLoading) {
    if (!loggedInUser || !token) {
      return <Navigate to="/login" replace />;
    }

    return (
      <>
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isSmall={isSmall}
          isOpenAndSmall={isOpenAndSmall}
        />
        {/* <Navbar /> */}
        <div
          className="col  p-0"
          {...(isSmall
            ? {}
            : { style: { marginLeft: `${isOpen ? "185px" : "100px"}` } })}
        >
          {children}
        </div>
      </>
    );
  } else {
    return (
      <div
        className="d-flex justify-content-center align-items-center my-auto"
        style={{ height: "90vh" }}
      >
        <LoadingSpinner />
      </div>
    );
  }
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
};

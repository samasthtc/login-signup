import LoadingSpinner from "@/components/common/LoadingSpinner";
import Sidebar from "@/components/common/Sidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { debounce } from "../utils/debounce";

export default function PrivateLayout({ children }) {
  const { isLoading, token } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 575);
  const isOpenAndSmall = isOpen && isSmall;

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleResize = debounce(
      () => setIsSmall(window.innerWidth <= 575),
      150
    );
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const redirect = () => {
  //   if (!loggedInUser || !token) {
  //     logout();
  //   }
  // };

  // useEffect(() => {
  //   redirect();
  // }, [loggedInUser, token]);

  if (!isLoading) {
    // redirect();

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
          className={`col ${isSmall ? "pt-3 " : ""} p-0 min-vh-100`}
          {...(isSmall
            ? {}
            : { style: { marginLeft: `${isOpen ? "160px" : "100px"}` } })}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center my-auto"
      style={{ height: "90vh" }}
    >
      <LoadingSpinner />
    </div>
  );
}

PrivateLayout.propTypes = {
  children: PropTypes.any,
};

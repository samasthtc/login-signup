// import React from 'react'
import { useContext } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../auth/authService";
import LoggedInUserContext from "../../context/loggedInUser/LoggedInUserContext";

export default function Navbar() {
  const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);

  const handleLogout = () => {
    logout();
    // @ts-ignore
    setLoggedInUser(null);
  };
  return (
    <nav className="navbar navbar-expand navbar-dark">
      <button
        className="navbar-toggler ms-auto me-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mynavbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="mynavbar">
        <ul
          className="navbar-nav ms-auto me-2 d-flex justify-content-end w-100"
          id="navbar-list"
        >
          {loggedInUser?.id !== -1 && (
            <>
              <li className="nav-item" id="navbar-profile">
                <Link
                  to={`/profile?current=true&id=${loggedInUser?.id}`}
                  className="nav-link"
                >
                  <i className="fas fa-user text-primary"></i>
                </Link>
              </li>
              <li
                className="nav-item"
                id="navbar-logout"
                onClick={handleLogout}
              >
                <Link to="/login" className="nav-link">
                  <i className="fas fa-sign-out text-primary"></i>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}


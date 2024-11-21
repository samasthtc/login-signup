import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Navbar() {
  const { loggedInUser, logout } = useAuth();
  const location = useLocation();

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
          {loggedInUser && (
            <>
              {location.pathname === "/" && (
                <li className="nav-item" id="navbar-profile">
                  <Link
                    to={`/profile?current=true&id=${loggedInUser?.id}`}
                    className="nav-link"
                  >
                    <i className="fas fa-user text-primary"></i>
                  </Link>
                </li>
              )}

              {location.pathname === "/profile" && (
                <li className="nav-item" id="navbar-home">
                  <Link to={`/`} className="nav-link">
                    <i className="fas fa-home text-primary"></i>
                  </Link>
                </li>
              )}

              <li
                className="nav-item"
                id="navbar-logout"
                onClick={logout}
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

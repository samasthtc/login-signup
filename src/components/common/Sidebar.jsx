import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Sidebar() {
  const { loggedInUser, logout } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const isCurrent = {
    home: location.pathname === "/",
    profile:
      location.pathname + location.search ===
      `/profile?current=true&id=${loggedInUser?.id}`,
  };

  return (
    <aside
      className={`d-flex flex-column flex-shrink-0 p-3 bg-secondary text-white
       rounded-end-4 position-relative sidebar ${isExpanded ? "" : "collapse"}`}
      style={{ maxWidth: "180px", height: "100vh", width: "170px" }}
    >
      <button
        className={`btn side-btn rounded-circle
       m-0 p-0 border-0 ${isExpanded ? "to-left" : ""}`}
        onClick={toggleExpand}
      >
        <i className="fa-solid fa-circle-chevron-right fa-2xl m-0 p-0"></i>
      </button>

      <ul className="nav nav-pills flex-column">
        <li
          className={`d-flex   ${
            isExpanded ? "justify-content-start" : "justify-content-center"
          }`}
        >
          <Link
            to={`/profile?current=true&id=${loggedInUser?.id}`}
            className={`nav-link ${
              isCurrent.profile ? "active" : ""
            } d-flex align-items-center link-dark text-decoration-none
           dropdown-toggle sidebar-header p-0 py-4 `}
          >
            <i className="fa-regular fa-circle-user fa-2xl "></i>
            <span
              className={`fw-semibold p-0 m-0 ms-2 ${
                !isExpanded ? "hidden" : ""
              }`}
            >
              {loggedInUser.name}
            </span>
          </Link>
        </li>
      </ul>

      <hr />

      <ul
        className={`nav nav-pills flex-column mb-auto ${
          isExpanded ? "align-content-start" : "align-content-center"
        }`}
      >
        <li className={`nav-item ${isExpanded ? "" : "fit-content"}`}>
          <Link
            to="/"
            className={`nav-link ${
              isCurrent.home ? "active" : ""
            } gap-2 d-flex align-items-center ${
              isExpanded ? "" : "rounded-circle p-25 justify-content-center"
            }`}
            aria-current="page"
          >
            <i className="fa-solid fa-house"></i>
            <span className={!isExpanded ? "hidden" : ""}>Home</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="#"
            className={`nav-link link-dark gap-2 d-flex align-items-center ${
              isExpanded ? "" : "rounded-circle p-25 justify-content-center"
            }`}
          >
            <i className="fa-solid fa-chart-line "></i>
            <span className={!isExpanded ? "hidden" : ""}>Dashboard</span>
          </Link>
        </li>
      </ul>

      <hr />
      <ul className="nav nav-pills flex-column">
        <li className="nav-item" onClick={logout}>
          <Link
            to="/login"
            className="nav-link link-dark gap-2 d-flex align-items-center fw-semibold"
          >
            <i className="fa-solid fa-sign-out"></i>
            <span className={!isExpanded ? "hidden" : ""}>Sign Out</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}

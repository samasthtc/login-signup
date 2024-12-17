import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Sidebar({
  isOpen,
  setIsOpen,
  isSmall,
  isOpenAndSmall,
}) {
  const sidebarRef = useRef(null);
  const { loggedInUser, logout } = useAuth();
  const location = useLocation();
  const toggleOpen = () => setIsOpen(!isOpen);

  const isCurrent = {
    home: location.pathname === "/",
    profile:
      location.pathname + location.search ===
      `/profile?current=true&id=${loggedInUser?._id}`,
    users: location.pathname === "/users",
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSmall &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmall]);

  const tooltipRefs = {
    profile: useRef(null),
    home: useRef(null),
    users: useRef(null),
    logOut: useRef(null),
  };

  const tooltipMap = {
    profile: "Go to Profile",
    home: "Go to Home",
    users: "Go to Users",
    logOut: "Sign Out",
  };

  useEffect(() => {
    const tooltipInstances = [];

    for (const key in tooltipRefs) {
      if (tooltipRefs[key].current) {
        const tooltipInstance = new window.bootstrap.Tooltip(
          tooltipRefs[key].current,
          {
            title: tooltipMap[key],
            placement: "top",
            trigger: "hover",
            fallbackPlacements: ["bottom", "right"],
          }
        );
        tooltipInstances.push(tooltipInstance);
      }
    }

    return () => {
      tooltipInstances.forEach((instance) => instance.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    {isSmall && (
      <div
      className="w-100 d-sm-none d-block bg-2 top-0 start-0 position-fixed shadow-sm"
      style={{ height: "50px", zIndex: "100" }}
    ></div>
    )}
      <aside
        ref={sidebarRef}
        className={`m-0  p-sm-3 py-4 px-4 d-flex flex-column flex-shrink-0 bg-2 text-white
       rounded-end-4 position-fixed sidebar fs-5 fs-sm-6  ${
         isOpen
           ? "col-10 col-md-auto col-sm-3"
           : "collapsed col-sm-1 col-lg-05 col-xl-05 w-0 min-w-sm-0 ps-0 pe-0"
       }`}
        style={{ minHeight: "100vh", zIndex: "1000" }}
      >
        {isSmall && (
          <>
            
            <button
              className={`btn d-sm-none sidebar-btn  rounded-circle
              p-0 border-0`}
              onClick={toggleOpen}
              style={{ zIndex: "1000" }}
            >
              <i className="fas fa-bars fa-2xl m-0 p-0"></i>
            </button>
          </>
        )}

        <button
          className={`btn side-btn rounded-circle
       m-0 p-0 border-0 ${isOpen ? "to-left" : ""}`}
          onClick={toggleOpen}
        >
          <i className="fa-solid fa-chevron-right fa-lg m-0 p-0"></i>
        </button>

        <ul
          className={`nav nav-pills flex-column d-flex ${
            isSmall ? "me-4" : ""
          } ${isOpen ? "align-content-start" : "align-content-center"}`}
        >
          <li
            ref={tooltipRefs.profile}
            data-bs-toggle={tooltipRefs.profile}
            className={`nav-item w-100 ${
              isOpen
                ? "justify-content-start"
                : "fit-content justify-content-center"
            }`}
            onClick={isOpenAndSmall ? () => setIsOpen(false) : () => {}}
          >
            <Link
              to={`/profile?current=true&id=${loggedInUser?._id}`}
              className={`nav-link  ${
                isCurrent.profile ? "active" : ""
              } d-flex align-items-center ${
                isOpen ? "" : "rounded-circle p-25 justify-content-center"
              }
               sidebar-header p-25 py-3 `}
            >
              <i className="fa-regular fa-circle-user fs-2"></i>
              <span
                className={`fw-semibold text-wrap p-0 m-0 ms-2 ${
                  !isOpen ? "d-sm-none" : ""
                }`}
              >
                {loggedInUser.name}
              </span>
            </Link>
          </li>
        </ul>

        <hr className={`text-secondary ${isSmall ? "me-4" : ""}`} />

        <ul
          className={`nav nav-pills flex-column mb-auto d-flex gap-2 ${
            isSmall ? "me-4" : ""
          } ${isOpen ? "align-content-start" : "align-content-center"}`}
        >
          <li
            ref={tooltipRefs.home}
            data-bs-toggle={tooltipRefs.home}
            className="nav-item"
          >
            <Link
              to="/"
              className={`nav-link d-flex align-items-center gap-2 ${
                isCurrent.home ? "active" : ""
              } ${isOpen ? "" : "rounded-circle p-25 justify-content-center "}`}
              onClick={isOpenAndSmall ? () => setIsOpen(false) : () => {}}
              style={{ minWidth: "49px", minHeight: "49px" }}
            >
              <i
                className="fa-solid fa-house fs-5 d-flex justify-content-center"
                style={{ minWidth: "25px" }}
              ></i>
              <span className={!isOpen ? "hidden" : ""}>Home</span>
            </Link>
          </li>
          <li
            ref={tooltipRefs.users}
            data-bs-toggle={tooltipRefs.users}
            className={`nav-item w-100 ${isOpen ? "" : "fit-content"}`}
            onClick={isOpenAndSmall ? () => setIsOpen(false) : () => {}}
          >
            <Link
              to="/users"
              className={`nav-link d-flex gap-2 align-items-center ${
                isCurrent.users ? "active" : ""
              }  ${isOpen ? "" : "rounded-circle p-25 justify-content-center"}`}
              aria-current="page"
              style={{ minWidth: "49px", minHeight: "49px" }}
            >
              <i
                className="fa-solid fa-users-line fs-5 d-flex justify-content-center"
                style={{ minWidth: "25px" }}
              ></i>
              <span className={!isOpen ? "hidden" : ""}>Users</span>
            </Link>
          </li>

          {/* <li className="nav-item">
            <Link
              to="#"
              className={`nav-link d-flex gap-2 align-items-center ${
                isOpen ? "" : "rounded-circle p-25 justify-content-center"
              }`}
              onClick={isOpenAndSmall ? () => setIsOpen(false) : () => {}}
              style={{ minWidth: "49px", minHeight: "49px" }}
            >
              <i
                className="fa-solid fa-chart-line fs-5 d-flex justify-content-center"
                style={{ minWidth: "25px" }}
              ></i>
              <span className={!isOpen ? "hidden" : ""}>Dashboard</span>
            </Link>
          </li> */}
        </ul>

        <hr className={`text-secondary ${isSmall ? "me-4" : ""}`} />

        <ul className={`nav nav-pills flex-column ${isSmall ? "me-4" : ""}`}>
          <li
            ref={tooltipRefs.logOut}
            data-bs-toggle={tooltipRefs.logOut}
            className="nav-item nav-link  gap-2 px-0 d-flex align-items-center
          justify-content-center fw-semibold"
            onClick={logout}
            role="button"
          >
            <i className="fa-solid fa-sign-out"></i>
            <span className={`${!isOpen ? "hidden" : ""}`}>Sign Out</span>
          </li>
        </ul>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  isOpenAndSmall: PropTypes.bool,
  isSmall: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

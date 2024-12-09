import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

// TODO: make it responsive for xs screens
export default function Sidebar() {
  const sidebarRef = useRef(null);
  const { loggedInUser, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const isCurrent = {
    home: location.pathname === "/",
    profile:
      location.pathname + location.search ===
      `/profile?current=true&id=${loggedInUser?._id}`,
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const tooltipRefs = {
    profile: useRef(null),
    home: useRef(null),
    logOut: useRef(null),
  };

  const tooltipMap = {
    profile: "Go to Profile",
    home: "Go to Home",
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
      <aside
        ref={sidebarRef}
        className={`m-0 me-sm-2 p-sm-3 py-4 px-4 d-flex flex-column flex-shrink-0 bg-secondary text-white
       rounded-end-4 position-relative sidebar fs-4 fs-sm-6 ${
         isOpen
           ? "col-10 col-md-auto col-sm-3 "
           : "collapsed col-10 col-sm-1 w-0 ps-0 pe-0"
       }`}
        style={{ height: "100vh" }}
      >
        <button
          className={`btn d-sm-none sidebar-btn bg-transparent rounded-circle
       p-0 border-0 ${isOpen ? "to-left" : ""}`}
          onClick={toggleOpen}
        >
          <i className="fas fa-bars fa-2xl m-0 p-0"></i>
        </button>

        <button
          className={`btn side-btn rounded-circle
       m-0 p-0 border-0 ${isOpen ? "to-left" : ""}`}
          onClick={toggleOpen}
        >
          <i className="fa-solid fa-circle-chevron-right fa-2xl m-0 p-0"></i>
        </button>

        <ul
          className={`nav nav-pills flex-column d-flex ${
            isOpen ? "align-content-start" : "align-content-center"
          }`}
        >
          <li
            ref={tooltipRefs.profile}
            data-bs-toggle={tooltipRefs.profile}
            className={`d-flex  ${
              isOpen ? "justify-content-start" : "justify-content-center"
            }`}
          >
            <Link
              to={`/profile?current=true&id=${loggedInUser?._id}`}
              className={`nav-link  ${
                isCurrent.profile ? "active" : ""
              } d-flex align-items-center link-dark text-decoration-none
           dropdown-toggle sidebar-header px-0 py-3`}
            >
              <i className="fa-regular fa-circle-user fa-2xl"></i>
              <span
                className={`fw-semibold text-wrap p-0 m-0 ms-2 ${
                  !isOpen ? "d-sm-none" : ""
                }`}
              >
                {loggedInUser.name} Shoora
              </span>
            </Link>
          </li>
        </ul>

        <hr />

        <ul
          className={`nav nav-pills flex-column mb-auto d-flex justify-content-center ${
            isOpen ? "align-content-start" : "align-content-center"
          }`}
        >
          <li
            ref={tooltipRefs.home}
            data-bs-toggle={tooltipRefs.home}
            className={`nav-item w-100 ${isOpen ? "" : "fit-content"}`}
          >
            <Link
              to="/"
              className={`nav-link ${
                isCurrent.home ? "active" : ""
              } gap-2 d-flex align-items-center ${
                isOpen ? "" : "rounded-circle p-25 justify-content-center"
              }`}
              aria-current="page"
            >
              <i className="fa-solid fa-house"></i>
              <span className={!isOpen ? "hidden" : ""}>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="#"
              className={`nav-link link-dark gap-2 d-flex align-items-center ${
                isOpen ? "" : "rounded-circle p-25 justify-content-center"
              }`}
            >
              <i className="fa-solid fa-chart-line "></i>
              <span className={!isOpen ? "hidden" : ""}>Dashboard</span>
            </Link>
          </li>
        </ul>

        <hr />
        <ul className="nav nav-pills flex-column">
          <li
            ref={tooltipRefs.logOut}
            data-bs-toggle={tooltipRefs.logOut}
            className="nav-item nav-link link-dark gap-2 px-0 d-flex align-items-center
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

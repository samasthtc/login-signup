import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function UserWelcome() {
  const { loggedInUser } = useAuth();

  return (
    <main
      className="container-fluid
    d-flex justify-content-center align-items-center h-100"
    >
      <div className="text-center">
        <h1 className="text-accent">
          Welcome,{" "}
          <span className="text-primary-accent">{loggedInUser?.name}!</span>
        </h1>

        <h3 className="text-muted">
          You are logged in as{" "}
          <span className="fst-italic">{loggedInUser?.role}</span>.
          <br />
          Where would you like to go?
        </h3>

        <div className="d-flex gap-2 justify-content-center">
          <Link to={`/profile?current=true&id=${loggedInUser?._id}`}>
            <button className="btn btn-lg btn-primary go-to-profile mt-4 floating rounded-pill">
              <i className="fas fa-user text-accent opacity-75" /> Go to profile
            </button>
          </Link>
          <Link to={`/`}>
            <button className="btn btn-lg btn-primary go-to-profile mt-4 floating rounded-pill">
              <i className="fas fa-house text-accent opacity-75" /> Go to home
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

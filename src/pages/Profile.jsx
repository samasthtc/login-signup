import EditForm from "@/components/EditForm";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { saveProfile } from "../auth/authService";
import LoggedInUserContext from "../context/loggedInUser/LoggedInUserContext";
import UsersListContext from "../context/usersList/UsersListContext";

export default function Profile() {
  const { loggedInUser } = useContext(LoggedInUserContext);
  const { usersList } = useContext(UsersListContext);
  const location = useLocation();

  const [queries, setQueries] = useState(
    new URLSearchParams(window.location.search)
  );
  const [user, setUser] = useState(null);

  // let userId = queries.get("id");
  // let isCurrent = queries.get("current");
  // if (isCurrent === "true") user = loggedInUser;
  // else user = usersList.find((u) => u.id === Number(userId));

  // const handleQueryChange = () => {

  // };

  useEffect(() => {
    const currentQueries = new URLSearchParams(window.location.search);
    setQueries(currentQueries);
    const userId = currentQueries.get("id");
    const isCurrent = currentQueries.get("current");
    console.log("location changed", userId, isCurrent);

    if (isCurrent === "true") {
      setUser(loggedInUser);
    } else {
      setUser(usersList.find((u) => u.id === Number(userId)));
    }
  }, [location, loggedInUser, usersList]);

  useEffect(() => {
    if (user) {
      console.log("Updated user:", user);
    }
  }, [user]);

  return (
    <main
      className="container-fluid my-5 d-flex justify-content-center
     align-items-center align-content-center"
    >
      <div
        className="row d-flex justify-content-center
     align-items-center align-content-center w-100"
      >
        {user && <EditForm user={user} onSubmit={saveProfile} />}
      </div>
    </main>
  );
}

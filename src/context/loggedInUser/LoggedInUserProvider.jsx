import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersListContext from "../usersList/UsersListContext";
import LoggedInUserContext from "./LoggedInUserContext";

export default function LoggedInUserProvider({ children }) {
  const navigate = useNavigate();
  const { usersList } = useContext(UsersListContext);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedLoggedInUser = localStorage.getItem("loggedInUserId");
    let currentUser;
    if (storedLoggedInUser !== "-1" && storedLoggedInUser !== "undefined") {
      currentUser = usersList.find(
        (user) => user.id == JSON.parse(storedLoggedInUser)
      );
    } else {
      currentUser = null;
    }
    return currentUser;
  });

  useEffect(() => {
    localStorage.setItem(
      "loggedInUserId",
      JSON.stringify(loggedInUser?.id ?? -1)
    );
    if (!loggedInUser) {
      navigate("/login");
    }
  }, [loggedInUser]);

  return (
    <LoggedInUserContext.Provider
      // @ts-ignore
      value={{ loggedInUser: loggedInUser, setLoggedInUser: setLoggedInUser }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
}

LoggedInUserProvider.propTypes = {
  children: PropTypes.any,
};

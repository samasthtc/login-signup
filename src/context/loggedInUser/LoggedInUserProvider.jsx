import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import UsersListContext from "../usersList/UsersListContext";
import LoggedInUserContext from "./LoggedInUserContext";

export default function LoggedInUserProvider({ children }) {
  const { usersList } = useContext(UsersListContext);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const storedLoggedInUser = localStorage.getItem("loggedInUserId");
    if (
      storedLoggedInUser !== "-1" &&
      storedLoggedInUser !== "undefined"
    ) {
      return usersList.find(
        (user) => user.id == JSON.parse(storedLoggedInUser)
      );
    } else {
      return { id: -1 };
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "loggedInUserId",
      JSON.stringify(loggedInUser?.id ?? -1)
    );
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

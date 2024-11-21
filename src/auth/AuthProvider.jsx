import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { UsersListContext } from "../context/usersList/UsersListProvider";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
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

  const login = (user) => {
    setLoggedInUser(user);
  };

  const logout = () => {
    setLoggedInUser(null);
  };

  useEffect(() => {
    localStorage.setItem("loggedInUserId", loggedInUser?.id ?? -1);
  }, [loggedInUser]);

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

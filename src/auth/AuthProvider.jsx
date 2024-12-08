import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { getUsers } from "../api/api";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // const { usersList, isLoading } = useContext(UsersListContext);
  const storedUserId = localStorage.getItem("loggedInUserId");
  console.log("Stored User ID:", storedUserId);
  const [token, setToken] = useState(localStorage.getItem("token") ?? null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (token) {
      fetchUsers(token);
    }
  }, [token]);

  const fetchUsers = async (token) => {
    try {
      const { success, data } = await getUsers(token);
      if (success) {
        setUsers(data);
        if (storedUserId) {
          const loggedIn = data.find(user => user._id === storedUserId);
          if (loggedIn) {
            console.log("Logged-in user found:", loggedIn);
            setLoggedInUser(loggedIn);
          }
        }
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (users.length > 0) {
  //     const storedUserId = localStorage.getItem("loggedInUserId");
  //     if (storedUserId) {
  //       const user = users.find((user) => {
  //         console.log("Checking user:", user._id, storedUserId);
  //         return user._id === storedUserId;
  //       });
  //       if (user) {
  //         console.log("Logged-in user found:", user);
  //         setLoggedInUser(user);
  //       }
  //     }
  //   }
  // }, [users]);

  // const storedLoggedInUser = localStorage.getItem("loggedInUserId");

  const login = (user, token) => {
    setLoggedInUser(user);
    setToken(token);
    localStorage.setItem("loggedInUserId", user._id);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setLoggedInUser(null);
    setToken(null);
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("token");
  };

  

  // useEffect(() => {
  //   let currentUser;
  //   if (storedLoggedInUser !== "-1" && storedLoggedInUser !== "undefined") {
  //     currentUser = users.find(
  //       (user) => user.id == JSON.parse(storedLoggedInUser)
  //     );
  //   } else {
  //     currentUser = null;
  //   }
  //   setLoggedInUser(currentUser);
  // }, [token]);

  // useEffect(() => {
  //   localStorage.setItem("loggedInUserId", loggedInUser?._id ?? -1);
  //   localStorage.setItem("token", token);
  // }, [loggedInUser, token]);

  return (
    <AuthContext.Provider
      value={{ loggedInUser, login, logout, token, isLoading, setIsLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

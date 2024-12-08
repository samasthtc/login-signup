import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { getUsers } from "../api/api";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const storedUserId = localStorage.getItem("loggedInUserId");
  const [token, setToken] = useState(localStorage.getItem("token") ?? null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(false);
  useEffect(() => {
    if (token && storedUserId) {
      fetchUsers(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUsers = async (token) => {
    try {
      const { success, data } = await getUsers(token);
      if (success) {
        if (storedUserId) {
          const loggedIn = data.find((user) => user._id === storedUserId);
          if (loggedIn) {
            login(loggedIn, token);
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

  const login = (user, userToken) => {
    const finalToken = userToken || token;
    setLoggedInUser(user);
    setToken(finalToken);
    localStorage.setItem("loggedInUserId", user._id);
    localStorage.setItem("token", finalToken);
  };

  const logout = () => {
    setLoggedInUser(null);
    setToken(null);
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        login,
        logout,
        token,
        isLoading,
        setIsLoading,
        triggerFetch,
        setTriggerFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.any,
};

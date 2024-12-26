import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../api/api";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const storedUserId =
    localStorage.getItem("loggedInUserId") === "undefined" ||
    localStorage.getItem("loggedInUserId") === "-1"
      ? null
      : localStorage.getItem("loggedInUserId");

  const [token, setToken] = useState(localStorage.getItem("token") ?? null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (token && storedUserId) {
      fetchUsers(token);
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUsers = async (token) => {
    try {
      const { success, data } = await getUsers();
      if (success) {
        if (storedUserId) {
          const loggedIn = data.find((user) => user._id === storedUserId);
          if (loggedIn) {
            login(loggedIn, token);
          }
        }
      } else {
        console.error("Failed to fetch users");
        logout()
      }
    } catch (error) {
      if (
        error.message === "Unauthorized: Invalid or missing Bearer token"
      ) {
        logout();
      }
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
    navigate("/login", { replace: true });
    
    setTimeout(() => {
      setLoggedInUser(null);
      setToken(null);
      localStorage.removeItem("loggedInUserId");
      localStorage.removeItem("token");
    }, 100);
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

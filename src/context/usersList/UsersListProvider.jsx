import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { getUsers } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";

// eslint-disable-next-line react-refresh/only-export-components
export const UsersListContext = createContext(null);

export default function UsersListProvider({ children }) {
  const [users, setUsers] = useState([]);
  const { token, isLoading, setIsLoading } = useAuth();


  const fetchUsers = async () => {
    try {
      const { success, data } = await getUsers(token);
      if (success) {
         setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
    fetchUsers();
    } 
  }, [isLoading, token]);

  // useEffect(() => {
  //   if (users.length > 0) {
  //     localStorage.setItem("usersList", JSON.stringify(users));
  //   }
  // }, [users]);

  return (
    <UsersListContext.Provider
      // @ts-ignore
      value={{
        usersList: users,
        setUsersList: setUsers,
        fetchUsers,
        isLoading,
      }}
    >
      {children}
    </UsersListContext.Provider>
  );
}

UsersListProvider.propTypes = {
  children: PropTypes.any,
};

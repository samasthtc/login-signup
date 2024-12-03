import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import { getUsers } from "../../api/api";

// eslint-disable-next-line react-refresh/only-export-components
export const UsersListContext = createContext(null);

export default function UsersListProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { success, data } = await getUsers();
      if (success) {
        if (data.length < 0) {
          const storedUsers = JSON.parse(
            localStorage.getItem("usersList") || "[]"
          );
          setUsers(storedUsers);
        } else setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
      const storedUsers = JSON.parse(localStorage.getItem("usersList") || "[]");
      setUsers(storedUsers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("usersList", JSON.stringify(users));
    }
  }, [users]);

  console.log(users);

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

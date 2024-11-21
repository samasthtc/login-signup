import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { users as initialUsers } from "../../data/mockUsers";

import { createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UsersListContext = createContext(null);

export default function UsersListProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("usersList");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      localStorage.setItem("usersList", JSON.stringify(initialUsers ?? []));
      return initialUsers;
    }
  });

  useEffect(() => {
    localStorage.setItem("usersList", JSON.stringify(users));
  }, [users]);

  return (
    <UsersListContext.Provider
      // @ts-ignore
      value={{ usersList: users, setUsersList: setUsers }}
    >
      {children}
    </UsersListContext.Provider>
  );
}

UsersListProvider.propTypes = {
  children: PropTypes.any,
};

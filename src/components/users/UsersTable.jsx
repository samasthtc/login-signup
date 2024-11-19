import { useContext, useMemo, useState } from "react";
import UsersListContext from "../../context/usersList/UsersListContext";
import useDebounce from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import SearchField from "../inputFields/SearchField";
import UserRow from "./UserRow";

export default function UsersTable() {
  const { usersList } = useContext(UsersListContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("name");

  const debouncedSearchChange = useDebounce((value) => {
    setSearchTerm(value);
  });

  const handleSearchChange = (value) => {
    setSearchInput(value);
    debouncedSearchChange(value);
  };

  const filteredList = useMemo(() => {
    return usersList.filter((user) => {
      return filter === "name"
        ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
        : user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [usersList, searchTerm, filter]);

  const userRows = filteredList.map((user) => {
    return <UserRow key={user.id} user={user} />;
  });

  return (
    <CardContainer position="right">
      <SearchField
        searchTerm={searchInput}
        setSearchTerm={handleSearchChange}
        filter={filter}
        setFilter={setFilter}
      />
      <div
        className="table-responsive  rounded rounded-3
      border border-2 border-primary"
      >
        <table
          id="results-table"
          className="table table-hover table-striped w-100"
        >
          <thead>
            <tr>
              <th className="table-primary"></th>
              <th className="table-primary user-header">User</th>
              <th className="table-primary name-header">Name</th>
              <th className="table-primary email-header">Email</th>
            </tr>
          </thead>
          <tbody>{userRows}</tbody>
        </table>
      </div>
    </CardContainer>
  );
}

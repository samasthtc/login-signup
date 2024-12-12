import { useContext, useMemo, useState } from "react";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import useDebounce from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import SearchField from "../inputFields/SearchField";
import UserRow from "./UserRow";

export default function UsersTable() {
  const { usersList, isLoading } = useContext(UsersListContext);
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
      const valueToCheck =
        filter === "name" ? user.name.toLowerCase() : user.email.toLowerCase();
      return valueToCheck.includes(searchTerm.toLowerCase());
    });
  }, [usersList, searchTerm, filter]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <CardContainer position="right">
      <SearchField
        searchTerm={searchInput}
        setSearchTerm={handleSearchChange}
        filter={filter}
        setFilter={setFilter}
      />
      <div
        className="table-responsive  rounded rounded-4
      border border-2 border-accent-shadow"
      >
        <table
          id="results-table"
          className="table table-hover table-striped w-100"
        >
          <thead>
            <tr>
              <th className="table-primarybg user-header ps-3">User</th>
              <th className="table-primarybg fit-content th-actions pe-3"></th>
              {/* <th className="table-primary name-header">Name</th>
              <th className="table-primary email-header">Email</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((user) => (
              <UserRow key={user._id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
}

import { useContext, useMemo, useState } from "react";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import useDebounce from "../../utils/debounce";
import CardContainer from "../common/CardContainer";
import LoadingSpinner from "../common/LoadingSpinner";
import SearchField from "../inputFields/SearchField";
import UserRow from "./UserRow";

export default function UsersTable() {
  const { usersList, isLoading } = useContext(UsersListContext);

  // const [usersList, setUsersList] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("name");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await fetchUsers();
  //     // setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

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

  // let userRows = filteredList.map((user) => {
  //   return <UserRow key={user._id} user={user} />;
  // });

  // useEffect(() => {
  //   userRows.current = filteredList.map((user) => {
  //     return <UserRow key={user._id} user={user} />;
  //   });
  // }, [usersList]);

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
      border border-2 border-primary"
      >
        <table
          id="results-table"
          className="table table-hover table-striped w-100"
        >
          <thead>
            <tr>
              <th className="table-primary fit-content th-actions"></th>
              <th className="table-primary user-header">User</th>
              {/* <th className="table-primary name-header">Name</th>
              <th className="table-primary email-header">Email</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((user) => {
              console.log(usersList, filteredList);
              return <UserRow key={user._id} user={user} />;
            })}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
}

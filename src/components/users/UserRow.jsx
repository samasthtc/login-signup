import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UsersListContext } from "../../context/usersList/UsersListProvider.jsx";

export default function UserRow({ user }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { id, name, email } = user;
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/profile?current=false&id=" + id);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsersList = usersList.filter((u) => u.id !== user.id);
      // @ts-ignore
      setUsersList(updatedUsersList);
      localStorage.setItem("usersList", JSON.stringify(updatedUsersList));
    }
  };

  return (
    <tr id={id} className="user-row">
      <td>
        <div className="dropdown">
          <button
            className="btn btn-link dropdown-toggle p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
          <ul className="dropdown-menu">
            <li onClick={handleEdit}>
              <a className="dropdown-item edit">Edit</a>
            </li>
            <li onClick={handleDelete}>
              <a className="dropdown-item delete">Delete</a>
            </li>
          </ul>
        </div>
      </td>
      <td className="user-info-md">
        <strong>{name}</strong>
      </td>
      <td className="user-info-md">{email}</td>
      <td className="user-info" role="button" onClick={handleEdit}>
        <div className="user-details">
          <strong>{name}</strong>
          <p className="user-email mb-0">{email}</p>
        </div>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

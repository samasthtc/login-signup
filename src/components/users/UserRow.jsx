import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import { UsersListContext } from "../../context/usersList/UsersListProvider.jsx";
import Modal from "../common/Modal.jsx";

export default function UserRow({ user }) {
  const { usersList, setUsersList } = useContext(UsersListContext);
  const { loggedInUser, logout } = useAuth();
  const { id, name, email } = user;
  const navigate = useNavigate();
  const userisLoggedIn = loggedInUser.id === id;

  const handleEdit = () => {
    navigate("/profile?current=false&id=" + id);
  };

  const handleDelete = () => {
    const updatedUsersList = usersList.filter((user) => user.id !== id);
    setUsersList(updatedUsersList);

    if (userisLoggedIn) {
      logout();
    }

    deleteUser(id);
  };

  return (
    <tr id={id} className="user-row">
      <td className="fit-content">
        <div className="dropdown fit-content">
          <button
            className="btn btn-link dropdown-toggle p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v"></i>
          </button>
          <ul className="dropdown-menu">
            <li onClick={handleEdit}>
              <button className="dropdown-item edit">Edit</button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item delete"
                data-bs-toggle="modal"
                data-bs-target={`#dlt-usr-${id}-modal`}
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
        <Modal
          key={id}
          id={`dlt-usr-${id}-modal`}
          title={`Delete user (${name})?\n${
            userisLoggedIn ? "You will be logged out." : ""
          }`}
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={handleDelete}
          showButtons={true}
        />
      </td>
      {/* <td className="user-info-md" role="button" onClick={handleEdit}>
        <strong>{name}</strong>
      </td>
      <td className="user-info-md" role="button" onClick={handleEdit}>
        {email}
      </td> */}
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

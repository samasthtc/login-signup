import PropTypes from "prop-types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import Modal from "../common/Modal.jsx";

export default function UserRow({ user }) {
  const { loggedInUser, logout, setTriggerFetch } = useAuth();
  const { _id, name, email } = user;
  const navigate = useNavigate();
  const userisLoggedIn = loggedInUser._id === _id;
  const errorModalRef = useRef();

  const handleEdit = () => {
    navigate(`/profile?current=${userisLoggedIn}&id=${_id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(_id, loggedInUser);
      setTriggerFetch(true);
      if (userisLoggedIn) {
        logout();
      }
    } catch (error) {
      console.log(error);

      const errorModal = new window.bootstrap.Modal(errorModalRef.current);
      errorModal.show();
      setTimeout(() => errorModal.hide(), 3500);
    }
  };

  return (
    <tr id={_id} className="user-row">
      <td className="user-info ps-3" role="button" onClick={handleEdit}>
        <div className="user-details">
          <strong>{name}</strong>
          <p className="user-email mb-0">{email}</p>
        </div>
      </td>
      <td className="fit-content pe-3">
        <div className="d-flex gap-2 justify-content-between fs-2 fs-sm-4 fs-md-5">
          <button
            type="button"
            className="btn edit p-0 border-0"
            onClick={handleEdit}
          >
            <i className="far fa-edit fa-xl"></i>
          </button>
          <button
            type="button"
            className="btn delete p-0 border-0"
            data-bs-toggle="modal"
            data-bs-target={`#dlt-usr-${_id}-modal`}
          >
            <i className="far fa-trash-can fa-xl"></i>
          </button>
        </div>
        {/* <div className="dropdown fit-content">
          <button
            className="btn btn-link dropdown-toggle p-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="far fa-trash-can text-danger"></i>
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
                data-bs-target={`#dlt-usr-${_id}-modal`}
              >
                Delete
              </button>
            </li>
          </ul>
        </div> */}
        <Modal
          key={_id}
          id={`dlt-usr-${_id}-modal`}
          title={`Delete user (${name})?\n${
            userisLoggedIn ? "You will be logged out." : ""
          }`}
          cancelText="Cancel"
          confirmText="Delete"
          onConfirm={handleDelete}
          showButtons={true}
        />
        <Modal
          id="error-modal"
          reff={errorModalRef}
          title="Action Not Authorized"
          body="You are not authorized to delete this user because you are not an admin."
          showButtons={false}
        />
      </td>
      {/* <td className="user-info-md" role="button" onClick={handleEdit}>
        <strong>{name}</strong>
      </td>
      <td className="user-info-md" role="button" onClick={handleEdit}>
        {email}
      </td> */}
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    _id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

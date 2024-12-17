import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../api/api";
import { useAuth } from "../../auth/AuthProvider";
import { UsersListContext } from "../../context/usersList/UsersListProvider";
import CardContainer from "../common/CardContainer";
import PasswordEditForm from "./PasswordEditForm";
import UserEditForm from "./UserEditForm";

export default function EditForm({ queries }) {
  const [editPassword, setEditPassword] = useState(false);
  const submit = updateUser;
  const { userId, isCurrent } = queries;
  const { loggedInUser, login } = useAuth();
  const { usersList, setUsersList } = useContext(UsersListContext);
  const [user, setUser] = useState(() => {
    if (isCurrent === "true") {
      return { ...loggedInUser };
    } else {
      const foundUser = usersList.find((u) => u._id === userId);
      return foundUser ? { ...foundUser } : null;
    }
  });
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const toggleEditPassword = () => {
    setEditPassword((prev) => !prev);
  };

  useEffect(() => {
    if (isCurrent === "true") {
      setUser({ ...loggedInUser });
    } else {
      const foundUser = usersList.find((u) => u._id === userId);
      setUser(foundUser ? { ...foundUser } : null);
    }
  }, [isCurrent, loggedInUser, userId, usersList, queries]);

  return (
    <CardContainer>
      {editPassword ? (
        <PasswordEditForm
          user={user}
          isCurrent={isCurrent}
          usersList={usersList}
          setUsersList={setUsersList}
          handleGoBack={handleGoBack}
          submit={submit}
          toggleEditPassword={toggleEditPassword}
          login={login}
        />
      ) : (
        <UserEditForm
          user={user}
          isCurrent={isCurrent}
          usersList={usersList}
          setUsersList={setUsersList}
          handleGoBack={handleGoBack}
          submit={submit}
          toggleEditPassword={toggleEditPassword}
          login={login}
        />
      )}
    </CardContainer>
  );
}

EditForm.propTypes = {
  queries: PropTypes.shape({
    isCurrent: PropTypes.string,
    userId: PropTypes.any,
  }),
};

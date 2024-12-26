import { deleteUser, getUsers, updateUser } from "../services/userService.js";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation.js";

export const handleGetUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    if (users.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No users found" });
    } else {
      return res.status(200).json({
        success: true,
        data: users,
        message: "Users fetched successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await deleteUser(userId);
    res.json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    if (error.message === "User not found!") {
      return res.status(404).json({
        success: false,
        message: { userId: error.message },
      });
    }
    next(error);
  }
};

export const handleUpdateUser = async (req, res, next) => {
  const { userId } = req.params;
  const changedData = req.body;

  const validationFields = ["name", "email", "New Password"];
  for (const field in validationFields) {
    if (changedData[field]) {
      const result =
        field === "name"
          ? validateName(changedData[field])
          : field === "email"
          ? validateEmail(changedData[field])
          : validatePassword(changedData[field]);

      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          message: { [field]: result.message },
        });
      }
    }
  }

  const updatedUserData = { _id: userId, ...changedData };
  try {
    const updatedUser = await updateUser(updatedUserData);
    res.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully!",
    });
  } catch (error) {
    if (error.message === "Email already exists!") {
      return res.status(409).json({
        success: false,
        message: { email: error.message },
      });
    } else if (error.message === "User not found!") {
      return res.status(404).json({
        success: false,
        message: { userId: error.message },
      });
    } else if (error.message === "Old Password is Incorrect!") {
      return res.status(401).json({
        success: false,
        message: { password: error.message },
      });
    } else if (error.message === "New Password is the same as the old one!") {
      return res.status(409).json({
        success: false,
        message: { password: error.message },
      });
    }

    next(error);
  }
};

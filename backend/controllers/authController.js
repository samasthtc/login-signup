import {
  deleteProfile,
  getUsers,
  login,
  register,
  updateUser,
} from "../services/authService.js";
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
        .status(201)
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

export const handleLogin = async (req, res, next) => {
  const userData = req.body;
  const { email, password } = userData;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    });
  }

  try {
    const [user, token] = await login(userData);
    res
      .status(200)
      .json({ success: true, data: user, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

export const handleRegister = async (req, res, next) => {
  const userData = req.body;

  const nameValidation = validateName(userData.name);
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);
  if (
    !nameValidation.isValid ||
    !emailValidation.isValid ||
    !passwordValidation.isValid
  ) {
    return res.status(400).json({
      success: false,
      message: {
        name: nameValidation.message,
        email: emailValidation.message,
        password: passwordValidation.message,
      },
    });
  }

  try {
    const user = await register(userData);
    res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await deleteProfile(id);
    res.json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req, res, next) => {
  const { id } = req.params;
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

  const updatedUser = { _id: id, ...changedData };
  try {
    const updatedProfile = await updateUser(updatedUser);
    res.json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};

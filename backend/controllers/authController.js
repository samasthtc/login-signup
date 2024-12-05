import {
  changePassword,
  deleteProfile,
  getUsersList,
  login,
  register,
  saveProfile,
} from "../services/authService.js";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation.js";

export const handleGetUsers = async (req, res) => {
  try {
    const users = getUsersList();
    if (users.length === 0) {
      return res
        .status(201)
        .json({ success: true, data: [], message: "No users found" });
    } else {
      return res.status(201).json({
        success: true,
        data: users,
        message: "Users fetched successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const handleLogin = async (req, res) => {
  const userData = req.body;
  const { email, password } = userData;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    });
  }

  try {
    const user = await login(userData);
    res
      .status(201)
      .json({ success: true, data: user, message: "Login successful" });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const handleRegister = async (req, res) => {
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleDeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProfile(Number(id));
    res.json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleSaveProfile = async (req, res) => {
  const { id } = req.params;
  const changedData = req.body;
  const updatedUser = { id: Number(id), ...changedData };
  try {
    await saveProfile(updatedUser);
    res.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const handleChangePassword = async (req, res) => {
  const { id } = req.params;
  const passwords = req.body;
  
  try {
    await changePassword(id, passwords);
    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

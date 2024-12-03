// import bcrypt from "bcryptjs";
// import { addUser, findUserByEmail } from "../models/User.js";
// // import jwt from 'jsonwebtoken';

// export const getUsers = (req, res) => {
//   try {
//     res.json(getUsers());
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to fetch users" });
//   }
// };

// export const register = async (req, res) => {
//   const { email, password, name, role } = req.body;
//   try {
//     const userExists = findUserByEmail(email);
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { name, email, password: hashedPassword, role };
//     addUser(newUser);

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error registering user" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = findUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ message: "Login successful" }); //res.json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error logging in", error });
//   }
// };

// export const logout = (req, res) => {
//   res.json({ message: "Logged out successfully" });
// };

import {
  deleteProfile,
  getUsersList,
  login,
  register,
  saveProfile,
} from "../services/authService.js";

export const handleGetUsers = async (req, res) => {
  try {
    await res.json(getUsersList());
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch users", error });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login({ email, password });
    if (result.success) res.json(result);
    else res.status(401).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error logging in", error });
  }
};

export const handleRegister = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("req.body", req.body);
  
  try {
    const result = await register({ name, email, password, role });
    if (result.success) res.status(201).json(result);
    else res.status(400).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error registering user", error });
  }
};

export const handleDeleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await deleteProfile(email);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting user", error });
  }
};

export const handleSaveProfile = async (req, res) => {
  // const { id } = req.params;
  const { id, name, email, password, role } = req.body;
  const updatedUser = { id: Number(id), name, email, password, role };
  try {
    const result = await saveProfile(updatedUser);
    if (result.success) res.json(result);
    else res.status(400).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error saving profile", error });
  }
};

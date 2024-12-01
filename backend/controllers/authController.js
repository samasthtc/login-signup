import bcrypt from "bcryptjs";
import { addUser, findUserByEmail } from "../models/User.js";
// import jwt from 'jsonwebtoken';

export const getUsers = (req, res) => {
  try {
    res.json(getUsers());
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const register = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const userExists = findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, role };
    addUser(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful" }); //res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in", error });
  }
};

export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};


/* 
import {
  deleteUser,
  getUsers,
  login,
  register,
  saveProfile,
} from "../services/authService.js";

export const handleGetUsers = (req, res) => {
  res.json(getUsers());
};

export const handleLogin = (req, res) => {
  const { email, password } = req.body;
  const result = login({ email, password });
  if (result.isValid) res.json(result);
  else res.status(401).json(result);
};

export const handleRegister = (req, res) => {
  const { name, email, password } = req.body;
  const result = register({ name, email, password });
  if (result.isValid) res.status(201).json(result);
  else res.status(400).json(result);
};

export const handleDeleteUser = (req, res) => {
  const { id } = req.params;
  const result = deleteUser(Number(id));
  res.json(result);
};

export const handleSaveProfile = (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const result = saveProfile(Number(id), { name, email, password });
  if (result.isValid) res.json(result);
  else res.status(400).json(result);
};

*/
import bcrypt from "bcryptjs";
import { findUserByEmail, getUsers } from "../models/User.js";

let users = [];

export const getUsersList = () => {
  try {
    return getUsers();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch users" };
  }
};

export const login = async ({ email, password }) => {
  //TODO: Continue from here
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
    res
      .status(500)
      .json({ success: false, message: "Error logging in", error });
  }
  const user = users.find((u) => u.email === email);
  return user && user.password === password
    ? { isValid: true, user }
    : { isValid: false, message: "Invalid credentials" };
};

export const register = async ({ name, email, password, role }) => {
  if (findUserByEmail(email)) {
    return { isValid: false, message: "User already exists!" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { name, email, password: hashedPassword, role };
  users.push(newUser);
  return {
    isValid: true,
    message: "User registered successfully!",
    user: newUser,
  };
};

export const saveProfile = (id, { name, email, password }) => {
  if (findUserByEmail(email)) {
    return { isValid: false, message: "Email already exists!" };
  }
  users = users.map((user) =>
    user.id === id ? { ...user, name, email, password } : user
  );
  return { isValid: true, message: "Profile updated successfully!" };
};

export const deleteUser = (id) => {
  users = users.filter((user) => user.id !== id);
  return { isValid: true, message: "User deleted successfully!" };
};

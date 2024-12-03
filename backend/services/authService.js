import bcrypt from "bcryptjs";
import {
  addUser,
  deleteUser,
  findUserByEmail,
  findUserByEmailAndId,
  getUsers,
  updateUser,
} from "../models/User.js";

// let users = [];

export const getUsersList = () => getUsers();

export const login = async ({ email, password }) => {
  //TODO: Continue from here

  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  
  if (!isMatch) {
    return { success: false, message: "Invalid credentials" };
  }

  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { success: true, message: "Login successful", user }; //res.json({ message: 'Login successful', token });
};

export const register = async ({ name, email, password, role }) => {
  if (findUserByEmail(email)) {
    return { success: false, message: "User already exists!" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { name, email, password: hashedPassword, role };
  // users.push(newUser);
  addUser(newUser);
  return {
    success: true,
    message: "User registered successfully!",
  };
};

export const saveProfile = (updatedUser) => {
  if (!findUserByEmailAndId(updatedUser.email, updatedUser.id)) {
    if (findUserByEmail(updatedUser.email))
      return { success: false, message: "Email already exists!" };
  }

  updateUser(updatedUser.email, updatedUser);
  return { success: true, message: "Profile updated successfully!" };
};

export const deleteProfile = (email) => {
  deleteUser(email);
  return { success: true, message: "User deleted successfully!" };
};

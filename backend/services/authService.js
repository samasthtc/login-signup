import bcrypt from "bcryptjs";
import {
  addUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  getUsers,
  updateUser,
} from "../models/User.js";

export const getUsersList = () => getUsers();

export const login = async ({ email, password }) => {
  const user = findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = async ({ name, email, password, role }) => {
  if (findUserByEmail(email)) throw new Error("User already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hashedPassword, role };
  addUser(newUser);
};

export const saveProfile = async (updatedUser) => {
  const existingUser = findUserById(updatedUser.id);
  if (!existingUser) throw new Error("User not found!");

  if (
    updatedUser.email !== existingUser.email &&
    findUserByEmail(updatedUser.email)
  ) {
    throw new Error("Email already exists!");
  }

  if (updatedUser.password) {
    updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
  }

  await updateUser(updatedUser.id, { ...existingUser, ...updatedUser });
};

export const deleteProfile = async (id) => {
  const status = await deleteUser({ id });
  if (status === -1) throw new Error("User not found!");
};

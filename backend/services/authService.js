import bcrypt from "bcryptjs";
import {
  addUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  getUsers,
  updateUser,
} from "../models/User.js";

export const getUsersList = () => {
  const list = getUsers();
  return list.map((user) => {
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const getUserById = (id) => {
  const user = findUserById(id);
  if (!user) throw new Error("User not found!");
  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

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
  let newUser = { name, email, password: hashedPassword, role };
  newUser = addUser(newUser);

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
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

  await updateUser({ ...existingUser, ...updatedUser });

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = findUserById(updatedUser.id);
  return userWithoutPassword;
};

export const changePassword = async (id, passwords) => {
  const user = findUserById(id);

  if (!user) throw new Error("User not found!");

  const isMatch = await bcrypt.compare(
    passwords["Old Password"],
    user.password
  );
  if (!isMatch) throw new Error("Old Password is Incorrect!");

  const isNewMatch = await bcrypt.compare(
    passwords["New Password"],
    user.password
  );
  if (isNewMatch) throw new Error("New Password is the same as the old one!");

  const hashedPassword = await bcrypt.hash(passwords["New Password"], 10);
  await updateUser({ ...user, password: hashedPassword });

  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = findUserById(id);
  return userWithoutPassword;
};

export const deleteProfile = async (id) => {
  const status = await deleteUser({ id });
  if (status === -1) throw new Error("User not found!");
};

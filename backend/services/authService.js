import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getFullUserByEmail,
  getFullUserById,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../services/userService.js";

export const getUsers = async () => {
  return await getAllUsers();
};

export const findUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found!");
  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await getFullUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // eslint-disable-next-line no-undef
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return [user, token];
};

export const register = async ({ name, email, password, role }) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error("User already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return newUser;
};

export const updateUser = async (updatedUser) => {
  let finalUpdatedUser = {};

  const existingUser = await getFullUserById(updatedUser._id);

  if (!existingUser) throw new Error("User not found!");

  if (
    updatedUser.email !== existingUser.email &&
    (await getUserByEmail(updatedUser.email))
  ) {
    throw new Error("Email already exists!");
  }

  for (const key in updatedUser) {
    if (
      key !== "Old Password" &&
      key !== "New Password" &&
      key !== "Confirm Password"
    )
      finalUpdatedUser[key] = updatedUser[key];
  }

  if (updatedUser["Old Password"] && updatedUser["New Password"]) {
    const isMatch = await bcrypt.compare(
      updatedUser["Old Password"],
      existingUser.password
    );
    if (!isMatch) throw new Error("Old Password is Incorrect!");

    const isNewMatch = await bcrypt.compare(
      updatedUser["New Password"],
      existingUser.password
    );
    if (isNewMatch) throw new Error("New Password is the same as the old one!");

    const hashedPassword = await bcrypt.hash(updatedUser["New Password"], 10);

    finalUpdatedUser.password = hashedPassword;
  }

  updatedUser = await updateUserById(existingUser._id, finalUpdatedUser);
  return updatedUser;
};

export const deleteProfile = async (userId) => {
  const deletedUser = await deleteUserById(userId);
  if (!deletedUser) {
    throw new Error("User not found!");
  }
  console.log("Deleted User:", deletedUser);
  return deletedUser;
};

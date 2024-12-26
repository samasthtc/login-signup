import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select("-password");
};

export const getFullUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

export const getFullUserById = async (userId) => {
  return await User.findById(userId);
};

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return await User.findById(user._id).select("-password").lean();
};

export const updateUserById = async (userId, updatedUserData) => {
  return await User.findByIdAndUpdate(userId, updatedUserData, {
    new: true,
  }).select("-password");
};

export const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId).select("-password");
};

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

export const deleteUser = async (userId) => {
  const deletedUser = await deleteUserById(userId);
  if (!deletedUser) {
    throw new Error("User not found!");
  }
  return deletedUser;
};

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

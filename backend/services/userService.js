import User from "../models/User.js";

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select("-password");
};

export const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const getFullUserById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return await User.findById(user._id).select("-password").lean();
};

export const updateUserById = async (id, updatedUserData) => {
  return await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  }).select("-password");
};

export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id).select("-password");
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getFullUserById,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "../services/userService.js";

export const getUsers = async () => {
  return await getAllUsers();
};

export const findUserById = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found!");
  // eslint-disable-next-line no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);
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

export const saveProfile = async (updatedUser) => {
  let finalUpdatedUser = {};

  const existingUser = await getFullUserById(updatedUser._id);
  console.log(updatedUser);
  
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

// export const changePassword = async (id, passwords) => {
//   const user = getUserById(id);

//   if (!user) throw new Error("User not found!");

//   const isMatch = await bcrypt.compare(
//     passwords["Old Password"],
//     user.password
//   );
//   if (!isMatch) throw new Error("Old Password is Incorrect!");

//   const isNewMatch = await bcrypt.compare(
//     passwords["New Password"],
//     user.password
//   );
//   if (isNewMatch) throw new Error("New Password is the same as the old one!");

//   const hashedPassword = await bcrypt.hash(passwords["New Password"], 10);
//   await updateUser({ ...user, password: hashedPassword });

//   // eslint-disable-next-line no-unused-vars
//   const { password, ...userWithoutPassword } = getUserById(id);
//   return userWithoutPassword;
// };

export const deleteProfile = async (id) => {
  const deletedUser = await deleteUserById( id );
  if (!deletedUser) {
    throw new Error("User not found!");
  }
  console.log("Deleted User:", deletedUser);
  return deletedUser;
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getFullUserByEmail,
  getUserByEmail,
} from "../services/userService.js";

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

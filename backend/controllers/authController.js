import { login, register } from "../services/authService.js";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation.js";

export const handleLogin = async (req, res, next) => {
  const userData = req.body;
  const { email, password } = userData;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    });
  }

  try {
    const [user, token] = await login(userData);
    res
      .status(200)
      .json({ success: true, data: user, message: "Login successful", token });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    next(error);
  }
};

export const handleRegister = async (req, res, next) => {
  const userData = req.body;

  const nameValidation = validateName(userData.name);
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);
  if (
    !nameValidation.isValid ||
    !emailValidation.isValid ||
    !passwordValidation.isValid
  ) {
    return res.status(400).json({
      success: false,
      message: {
        name: nameValidation.message,
        email: emailValidation.message,
        password: passwordValidation.message,
      },
    });
  }

  try {
    const user = await register(userData);
    res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully!",
    });
  } catch (error) {
    if (error.message === "User already exists!") {
      return res.status(409).json({
        success: false,
        message: { email: error.message },
      });
    }
    next(error);
  }
};

export function validateField(value, validationCallback) {
  const result = validationCallback(value);
  return result;
}

export function validateName(value) {
  if (value.length > 2) {
    return { isValid: true, errorMessage: "" };
  }
  return {
    isValid: false,
    errorMessage: "Name must have more than 2 characters.",
  };
}

export function validateEmail(value) {
  if (value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return {
      isValid: true,
      errorMessage: "",
    };
  }
  return { isValid: false, errorMessage: "Invalid email." };
}

export function validatePassword(password) {
  if (
    password.match(
      /^(?=.*[0-9])(?=.*[\s.-_,!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9\s.-_,!@#$%^&*]{8,16}$/
    )
  ) {
    return { isValid: true, errorMessage: "" };
  }

  // let errorText = "Password must be between 8 and 16 characters, contain a number, special character, and uppercase letter.";
  // return { isValid: false, errorMessage: errorText };

  let errorText = "";

  if (password.length < 8 || password.length > 16) {
    errorText = "Password must be between 8 and 16 characters long.";
  } else if (!/^(?=.*[0-9])(?=.*[\s.,!@#$%^&*])/.test(password)) {
    errorText =
      "Password must contain at least one number and one special character.";
  } else if (!/^(?=.*[A-Z])/.test(password)) {
    errorText = "Password must contain at least one uppercase letter.";
  }

  return {
    isValid: false,
    errorMessage: errorText,
  };
}


export function validateCredentials(email, password, usersList) {
  const user = usersList.find((u) => u.email === email);
  if (user && user.password === password) return { isValid: true, user: user };

  return { isValid: false, message: "Invalid credentials" };
}

export function login({ email, password }, usersList) {
  const result = validateCredentials(email, password, usersList);
  if (result.isValid) {
    localStorage.setItem("loggedInUserId", result.userId);
  }
  return result;
}

export function register({ name, email, password }, usersList) {
  if (
    usersList.some((user) => user.email.toLowerCase() === email.toLowerCase())
  ) {
    return { isValid: false, message: "User already exists!" };
  }
  const newUser = { id: Date.now(), name, email, password };
  const updatedList = [...usersList, newUser];
  localStorage.setItem("usersList", JSON.stringify(usersList));
  return {
    isValid: true,
    newUser: newUser,
    updatedList: updatedList,
  };
}

export function logout() {
  localStorage.setItem("loggedInUserId", "-1");
}

export function saveProfile(id, { name, email, password }, usersList) {
  const updatedList = usersList.map((user) => {
    if (user.id === id) {
      return { id, name, email, password };
    }
    return user;
  });
  localStorage.setItem("usersList", JSON.stringify(updatedList));
  return { isValid: true, updatedList: updatedList };
}

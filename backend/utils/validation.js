export function validateField(value, validationCallback) {
  return validationCallback(value);
}

export function validateName(value) {
  return value.length > 2
    ? { isValid: true, message: "" }
    : {
        isValid: false,
        message: "Name must have more than 2 characters.",
      };
}

export function validateEmail(value) {
  return /^[\w-_]+(\.[\w-_]+)*@[\w-_]+(\.[\w-_]+)*(\.[a-z]{2,})$/.test(value)
    ? { isValid: true, message: "" }
    : { isValid: false, message: "Invalid email." };
}

export function validatePassword(password) {
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*.,\-_]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const isValidLength = password.length >= 8 && password.length <= 16;

  let errorText = "";
  if (!isValidLength)
    errorText = "Password must be between 8 and 16 characters.";
  else if (!hasNumber) errorText = "Password must contain at least one number.";
  else if (!hasSpecialChar)
    errorText = "Password must contain at least one special character.";
  else if (!hasUpperCase)
    errorText = "Password must contain at least one uppercase letter.";

  return errorText
    ? { isValid: false, message: errorText }
    : { isValid: true, message: "" };
}

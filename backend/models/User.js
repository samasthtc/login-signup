let users = [];

class User {
  constructor({ name, email, password, role = "user" }) {
    this.id = Date.now();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export const addUser = (userData) => {
  const newUser = new User(userData);
  users.push(newUser);
};

export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const getUsers = () => {
  return users;
};

export const deleteUser = (email) => {
  users = users.filter((user) => user.email !== email);
};

export const updateUser = (email, updatedUserData) => {
  const updatedUser = new User(updatedUserData);
  users = users.map((user) => (user.email === email ? updatedUser : user));
};

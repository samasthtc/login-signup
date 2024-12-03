let users = [];

class User {
  constructor({ id = Date.now(), name, email, password, role = "user" }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export const addUser = (userData) => {
  const newUser = new User(userData);
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

export const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

export const findUserByEmailAndId = (email, id) => {
  return users.find((user) => user.email === email && user.id === id);
};

export const getUsers = () => users;

export const deleteUser = ({ id }) => {
  if (!findUserById(id)) return -1;
  users = users.filter((user) => user.id !== id);
};

export const updateUser = (id, updatedUserData) => {
  const updatedUser = new User(updatedUserData);
  users = users.map((user) => (user.id === id ? updatedUser : user));
};

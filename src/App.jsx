import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import LoggedInUserProvider from "./context/loggedInUser/LoggedInUserProvider.jsx";
import UsersListProvider from "./context/usersList/UsersListProvider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <UsersListProvider>
        <LoggedInUserProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </LoggedInUserProvider>
      </UsersListProvider>
    </div>
  );
}

export default App;

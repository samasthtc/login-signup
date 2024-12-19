import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import UsersListProvider from "./context/usersList/UsersListProvider";
import GeneralLayout from "./layouts/GeneralLayout.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Post = lazy(() => import("./pages/Post"));

const loadingSpinner = (
  <div
    className="d-flex app justify-content-center align-items-center my-auto"
    style={{ height: "90vh" }}
  >
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <AuthProvider>
          <Suspense fallback={loadingSpinner}>
            <Routes>
              <Route
                path="/login"
                element={
                  <GeneralLayout>
                    <Login />
                  </GeneralLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <GeneralLayout>
                    <Register />
                  </GeneralLayout>
                }
              />
              <Route
                path="/"
                element={
                  <UsersListProvider>
                    <PrivateLayout>
                      <Home />
                    </PrivateLayout>
                  </UsersListProvider>
                }
              />
              <Route
                path="/users"
                element={
                  <UsersListProvider>
                    <PrivateLayout>
                      <Users />
                    </PrivateLayout>
                  </UsersListProvider>
                }
              />
              <Route
                path="/profile"
                element={
                  <UsersListProvider>
                    <PrivateLayout>
                      <Profile />
                    </PrivateLayout>
                  </UsersListProvider>
                }
              />
              <Route
                path="/post/:id"
                element={
                  <UsersListProvider>
                    <PrivateLayout>
                      <Post />
                    </PrivateLayout>
                  </UsersListProvider>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;

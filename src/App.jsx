import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import UsersListProvider from "./context/usersList/UsersListProvider";
import GeneralLayout from "./layouts/GeneralLayout.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const ReactHForm = lazy(() => import("./pages/ReactHForm"));

const loadingSpinner = (
  <div
    className="d-flex justify-content-center align-items-center my-auto"
    style={{ height: "90vh" }}
  >
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <div className="App">
      <UsersListProvider>
        <AuthProvider>
          <Suspense fallback={loadingSpinner}>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateLayout>
                    <Home />
                  </PrivateLayout>
                }
              />
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
                path="/profile"
                element={
                  <PrivateLayout>
                    <Profile />
                  </PrivateLayout>
                }
              />
              <Route
                path="/form"
                element={
                  <GeneralLayout>
                    <ReactHForm />
                  </GeneralLayout>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </UsersListProvider>
    </div>
  );
}

export default App;

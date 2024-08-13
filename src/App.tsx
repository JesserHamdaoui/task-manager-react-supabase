import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/auth/Authentication";
import { AuthProvider } from "./hooks/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Authentication />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Authentication />
            </AuthRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

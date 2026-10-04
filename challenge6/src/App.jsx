import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ExerciseOnePage from "./pages/ExerciseOnePage";
import ExerciseTwoPage from "./pages/ExerciseTwoPage";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/ejercicio1" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/ejercicio1"
        element={
          <PrivateRoute>
            <ExerciseOnePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/ejercicio2"
        element={
          <PrivateRoute>
            <ExerciseTwoPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
import { Navigate, NavLink, Route, Routes } from "react-router";
import PlaylistPage from "./pages/PlaylistPage";
import BrowserHistoryPage from "./pages/BrowserHistoryPage";
import "./App.css";

function App() {
  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>Challenge 03</h2>
          <span>Estructuras de Datos</span>
        </div>

        <nav>
          <NavLink
            to="/playlist"
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Lista enlazada
          </NavLink>

          <NavLink
            to="/historial"
            className={({ isActive }) =>
              isActive ? "nav-active" : ""
            }
          >
            Lista doble
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/playlist" replace />}
        />

        <Route
          path="/playlist"
          element={<PlaylistPage />}
        />

        <Route
          path="/historial"
          element={<BrowserHistoryPage />}
        />
      </Routes>
    </>
  );
}

export default App;
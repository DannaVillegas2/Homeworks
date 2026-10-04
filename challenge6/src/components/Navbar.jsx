import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <strong>Challenge 06</strong>
      </div>

      <div className="navbar-links">
        <NavLink to="/ejercicio1">Ejercicio 1</NavLink>
        <NavLink to="/ejercicio2">Ejercicio 2</NavLink>
      </div>

      <div className="navbar-user">
        <span>
          Usuario: <strong>{user?.username}</strong>
        </span>

        <button onClick={handleLogout} className="btn-logout">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
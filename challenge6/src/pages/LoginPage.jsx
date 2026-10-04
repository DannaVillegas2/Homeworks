import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginCorrecto = login(email, password);

    if (loginCorrecto) {
      setError("");
      navigate("/ejercicio1");
    } else {
      setError("Correo electrónico o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

        <p>Ingresa tus credenciales para continuar.</p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Correo electrónico</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@mail.com"
            />
          </div>

          <div className="campo">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-login">
            Iniciar sesión
          </button>
        </form>

        <div className="demo">
          <strong>Usuario de prueba</strong>

          <p>Correo: user@mail.com</p>
          <p>Contraseña: 123</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";

function RegisterPage() {
  const navigate = useNavigate();

  const { register, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await register(email.trim(), password);

      navigate("/");
    } catch (firebaseError) {
      setError(
        getFirebaseErrorMessage(firebaseError)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">FS</div>

        <p className="auth-overline">
          PARCIAL 2
        </p>

        <h1>Crear cuenta</h1>

        <p className="auth-description">
          Regístrate para administrar
          la estructura de archivos.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Correo electrónico

            <input
              type="email"
              placeholder="usuario@correo.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirmar contraseña

            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
            />
          </label>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login">
            Iniciar sesión
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
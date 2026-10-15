import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";

function LoginPage() {
  const navigate = useNavigate();

  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Debes ingresar correo y contraseña.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

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

        <h1>File Structure</h1>

        <p className="auth-description">
          Gestiona tus archivos y carpetas
          mediante una estructura jerárquica
          segura.
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
              placeholder="••••••••"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
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
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta?{" "}
          <Link to="/register">
            Crear cuenta
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;

import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensaje("");

    try {
      if (esRegistro) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        setMensaje(
          data.session
            ? "¡Cuenta creada correctamente!"
            : "Revisa tu correo para confirmar tu cuenta."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">✓</div>

        <h1>TaskFlow</h1>
        <p className="subtitle">
          Organiza tus tareas de forma sencilla
        </p>

        <h2>
          {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <form onSubmit={manejarSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {mensaje && <p className="success">{mensaje}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={cargando}
          >
            {cargando
              ? "Procesando..."
              : esRegistro
              ? "Registrarme"
              : "Iniciar sesión"}
          </button>
        </form>

        <p className="switch-auth">
          {esRegistro
            ? "¿Ya tienes una cuenta?"
            : "¿No tienes una cuenta?"}
          <button
            type="button"
            onClick={() => {
              setEsRegistro(!esRegistro);
              setError("");
              setMensaje("");
            }}
          >
            {esRegistro ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { supabaseConfigurado } from '../Services/supabase';

export default function Login() {
  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { usuario, entrar, registrar, salir } = useAuth();
  const navegar = useNavigate();

  const cambiarModo = () => {
    setModo((actual) =>
      actual === 'entrar' ? 'registro' : 'entrar'
    );

    setMensaje('');
    setTipoMensaje('');
    setPassword('');
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (enviando) return;

    setMensaje('');
    setTipoMensaje('');

    if (!supabaseConfigurado) {
      setTipoMensaje('error');
      setMensaje(
        'No se detectó la configuración de Supabase. ' +
        'Revisa el archivo .env.local y reinicia Vite.'
      );
      return;
    }

    const correo = email.trim().toLowerCase();

    if (!correo || password.length < 6) {
      setTipoMensaje('error');
      setMensaje(
        'Ingresa un correo válido y una contraseña ' +
        'de al menos 6 caracteres.'
      );
      return;
    }

    setEnviando(true);

    try {
      if (modo === 'registro') {
        await registrar(correo, password);

        setTipoMensaje('exito');
        setMensaje(
          'Solicitud de registro procesada. ' +
          'Revisa tu correo electrónico para ' +
          'confirmar tu cuenta si es necesario.'
        );

        setPassword('');
      } else {
        await entrar(correo, password);
        navegar('/cotizaciones');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);

      setTipoMensaje('error');
      setMensaje(
        error?.message ||
        'No fue posible completar la operación.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await salir();
      setMensaje('');
      setTipoMensaje('');
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(
        error?.message ||
        'No se pudo cerrar la sesión.'
      );
    }
  };

  return (
    <main className="login-pagina">
      <div className="login-tarjeta">

        {usuario ? (
          <>
            <h1>Mi cuenta</h1>

            <p>
              Sesión iniciada: {usuario.email}
            </p>

            <Link
              to="/cotizaciones"
              className="boton-verde"
            >
              Mis cotizaciones
            </Link>

            <button
              type="button"
              className="boton-secundario"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <h1>
              {modo === 'registro'
                ? 'Crear cuenta'
                : 'Iniciar sesión'}
            </h1>

            <p className="login-subtitulo">
              Bienvenido a Distribuidor Eléctrico de Cali
            </p>

            <form
              className="login-form"
              onSubmit={guardar}
            >
              <label htmlFor="dec-email">
                Correo electrónico
              </label>

              <input
                id="dec-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@ejemplo.com"
              />

              <label htmlFor="dec-password">
                Contraseña
              </label>

              <input
                id="dec-password"
                type="password"
                required
                minLength={6}
                autoComplete={
                  modo === 'registro'
                    ? 'new-password'
                    : 'current-password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Mínimo 6 caracteres"
              />

              <button
                type="submit"
                className="boton-verde"
                disabled={enviando}
              >
                {enviando
                  ? 'Procesando...'
                  : modo === 'registro'
                    ? 'Registrarme'
                    : 'Ingresar'}
              </button>
            </form>

            <p className="login-enlace">
              {modo === 'registro'
                ? '¿Ya tienes cuenta? '
                : '¿No tienes cuenta? '}

              <button
                type="button"
                className="boton-enlace"
                onClick={cambiarModo}
              >
                {modo === 'registro'
                  ? 'Inicia sesión'
                  : 'Regístrate aquí'}
              </button>
            </p>

            {!supabaseConfigurado && (
              <p
                className="aviso-config"
                role="alert"
              >
                Supabase no está configurado.
                Revisa las variables de entorno
                y reinicia el servidor.
              </p>
            )}

            {mensaje && (
              <p
                role={tipoMensaje === 'error'
                  ? 'alert'
                  : 'status'}
                className="mensaje-formulario"
                style={{
                  color: tipoMensaje === 'error'
                    ? '#b42318'
                    : '#168B34'
                }}
              >
                {mensaje}
              </p>
            )}
          </>
        )}

      </div>
    </main>
  );
}

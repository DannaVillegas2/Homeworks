
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import TaskManager from "./components/TaskManager";
import AvatarUploader from "./components/AvatarUploader";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    const obtenerSesion = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error al obtener la sesión:", error.message);
      }

      if (activo) {
        setSession(data?.session ?? null);
        setCargando(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nuevaSession) => {
        if (activo) {
          setSession(nuevaSession);
          setCargando(false);
        }
      }
    );

    obtenerSesion();

    return () => {
      activo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      alert("No se pudo cerrar la sesión. Inténtalo nuevamente.");
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <h2>Cargando TaskFlow...</h2>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="dashboard">
      <header>
        <h2>TaskFlow</h2>

        <div className="task-user">
          <AvatarUploader user={session.user} />

          <span>{session.user.email}</span>

          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <TaskManager
          key={session.user.id}
          user={session.user}
        />
      </main>
    </div>
  );
}

export default App;
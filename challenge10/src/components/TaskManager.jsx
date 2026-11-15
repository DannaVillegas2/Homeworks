
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TaskManager({ user }) {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [enVivo, setEnVivo] = useState(false);

  const [editando, setEditando] = useState(null);
  const [tituloEditado, setTituloEditado] = useState("");
  const [descripcionEditada, setDescripcionEditada] = useState("");

  // READ: consultar tareas del usuario
  const cargarTareas = useCallback(async () => {
    const { data, error: errorBD } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (errorBD) {
      setError(errorBD.message);
    } else {
      setTareas(data || []);
    }

    setCargando(false);
  }, [user.id]);

  // REALTIME: escuchar cambios en Supabase
  useEffect(() => {
    cargarTareas();

    const canal = supabase
      .channel(`tasks-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        () => {
          cargarTareas();
        }
      )
      .subscribe((estado) => {
        if (estado === "SUBSCRIBED") {
          setEnVivo(true);
        } else if (
          estado === "CHANNEL_ERROR" ||
          estado === "TIMED_OUT" ||
          estado === "CLOSED"
        ) {
          setEnVivo(false);
        }
      });

    return () => {
      supabase.removeChannel(canal);
    };
  }, [cargarTareas, user.id]);

  // Ejecutar operaciones y actualizar lista
  const ejecutar = async (consulta) => {
    setError("");

    try {
      const { error: errorBD } = await consulta;

      if (errorBD) {
        throw errorBD;
      }

      await cargarTareas();
      return true;
    } catch (err) {
      setError(err.message || "Ocurrió un error");
      return false;
    }
  };

  // CREATE: crear tarea
  const crearTarea = async (e) => {
    e.preventDefault();

    if (!titulo.trim()) return;

    setGuardando(true);

    const exito = await ejecutar(
      supabase.from("tasks").insert({
        user_id: user.id,
        title: titulo.trim(),
        description: descripcion.trim(),
        completed: false,
      })
    );

    if (exito) {
      setTitulo("");
      setDescripcion("");
    }

    setGuardando(false);
  };

  // UPDATE: actualizar tarea
  const actualizarTarea = async (id, cambios) => {
    return ejecutar(
      supabase
        .from("tasks")
        .update(cambios)
        .eq("id", id)
        .eq("user_id", user.id)
    );
  };

  const comenzarEdicion = (tarea) => {
    setEditando(tarea.id);
    setTituloEditado(tarea.title);
    setDescripcionEditada(tarea.description || "");
  };

  const guardarEdicion = async (e, id) => {
    e.preventDefault();

    if (!tituloEditado.trim()) return;

    const exito = await actualizarTarea(id, {
      title: tituloEditado.trim(),
      description: descripcionEditada.trim(),
    });

    if (exito) {
      setEditando(null);
    }
  };

  // DELETE: eliminar tarea
  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta tarea?")) {
      return;
    }

    await ejecutar(
      supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
    );
  };

  const completadas = tareas.filter(
    (tarea) => tarea.completed
  ).length;

  return (
    <div className="task-layout">
      <div className="task-heading">
        <div>
          <h1>Mis tareas</h1>
          <p>Organiza tus actividades y cumple tus objetivos.</p>
        </div>

        <span className="task-realtime">
          {enVivo ? "● En tiempo real" : "○ Conectando..."}
        </span>
      </div>

      <div className="task-stats">
        <div>
          <strong>{tareas.length}</strong>
          <span>Total de tareas</span>
        </div>

        <div>
          <strong>{completadas}</strong>
          <span>Completadas</span>
        </div>

        <div>
          <strong>{tareas.length - completadas}</strong>
          <span>Pendientes</span>
        </div>
      </div>

      <section className="task-card">
        <h2>Crear nueva tarea</h2>

        <form onSubmit={crearTarea} className="task-form">
          <label>Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Terminar el Challenge 10"
            maxLength={120}
            required
          />

          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe tu tarea..."
            rows={3}
          />

          <button
            className="task-primary"
            type="submit"
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "+ Agregar tarea"}
          </button>
        </form>
      </section>

      {error && <p className="task-error">{error}</p>}

      <section className="task-card">
        <h2>Lista de tareas</h2>

        {cargando ? (
          <p>Cargando tareas...</p>
        ) : tareas.length === 0 ? (
          <div className="task-empty">
            <h3>Aún no tienes tareas</h3>
            <p>Agrega tu primera tarea para comenzar.</p>
          </div>
        ) : (
          <div className="task-list">
            {tareas.map((tarea) => (
              <article
                key={tarea.id}
                className={`task-item ${
                  tarea.completed ? "completed" : ""
                }`}
              >
                {editando === tarea.id ? (
                  <form
                    className="task-form"
                    onSubmit={(e) =>
                      guardarEdicion(e, tarea.id)
                    }
                  >
                    <input
                      value={tituloEditado}
                      onChange={(e) =>
                        setTituloEditado(e.target.value)
                      }
                      maxLength={120}
                      required
                    />

                    <textarea
                      value={descripcionEditada}
                      onChange={(e) =>
                        setDescripcionEditada(e.target.value)
                      }
                      rows={2}
                    />

                    <div className="task-actions">
                      <button
                        className="task-primary"
                        type="submit"
                      >
                        Guardar
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditando(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="task-info">
                      <input
                        type="checkbox"
                        checked={tarea.completed}
                        onChange={(e) =>
                          actualizarTarea(tarea.id, {
                            completed: e.target.checked,
                          })
                        }
                      />

                      <div>
                        <h3>{tarea.title}</h3>
                        <p>{tarea.description}</p>

                        <small>
                          {tarea.completed
                            ? "Completada"
                            : "Pendiente"}
                        </small>
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        onClick={() =>
                          comenzarEdicion(tarea)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="task-delete"
                        onClick={() =>
                          eliminarTarea(tarea.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
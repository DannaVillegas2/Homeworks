import { useState } from "react";
import ColaPersonas from "./structures/ColaPersonas";
import personasPrueba from "./data/personasPrueba.js";
import "./App.css";

const colaInicial = new ColaPersonas(personasPrueba);

function App() {
  const [nombre, setNombre] = useState("");
  const [montoRetiro, setMontoRetiro] = useState("");
  const [cola, setCola] = useState(colaInicial.getItems());

  const generarFechaAleatoria = () => {
    const ahora = new Date();

    const minutosAleatorios = Math.floor(Math.random() * 60);

    return new Date(
      ahora.getTime() - minutosAleatorios * 60 * 1000
    ).toISOString();
  };

  const agregarPersona = (event) => {
    event.preventDefault();

    if (!nombre.trim() || !montoRetiro) {
      return;
    }

    const nuevaPersona = {
      id: Date.now(),
      nombre: nombre.trim(),
      montoRetiro: Number(montoRetiro),
      fechaLlegada: generarFechaAleatoria(),
    };

    const nuevaCola = new ColaPersonas(cola);

    nuevaCola.enqueue(nuevaPersona);

    setCola(nuevaCola.getItems());

    setNombre("");
    setMontoRetiro("");
  };

  const atenderPersona = () => {
    const nuevaCola = new ColaPersonas(cola);

    nuevaCola.dequeue();

    setCola(nuevaCola.getItems());
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  };

  return (
    <main className="container">
      <header>
        <h1>🏧 Cola del Cajero Automático</h1>
        <p>
          Registra personas y administra el orden de atención según su fecha
          de llegada.
        </p>
      </header>

      <section className="form-container">
        <h2>Nueva persona</h2>

        <form onSubmit={agregarPersona}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>

            <input
              id="nombre"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto a retirar</label>

            <input
              id="monto"
              type="number"
              min="1"
              placeholder="Ej: 200000"
              value={montoRetiro}
              onChange={(event) => setMontoRetiro(event.target.value)}
            />
          </div>

          <button type="submit">Agregar a la cola</button>
        </form>
      </section>

      <section className="queue-container">
        <div className="queue-header">
          <div>
            <h2>Personas en la cola</h2>
            <span>{cola.length} persona(s) esperando</span>
          </div>

          <button
            className="attend-button"
            onClick={atenderPersona}
            disabled={cola.length === 0}
          >
            Atender siguiente
          </button>
        </div>

        {cola.length === 0 ? (
          <p className="empty-message">No hay personas esperando.</p>
        ) : (
          <div className="queue">
            {cola.map((persona, index) => (
              <article className="person-card" key={persona.id}>
                <div className="position">{index + 1}</div>

                <div className="person-info">
                  <h3>{persona.nombre}</h3>

                  <p>
                    <strong>Monto:</strong>{" "}
                    ${persona.montoRetiro.toLocaleString("es-CO")}
                  </p>

                  <p>
                    <strong>Llegada:</strong>{" "}
                    {formatearFecha(persona.fechaLlegada)}
                  </p>
                </div>

                {index === 0 && (
                  <span className="next-label">Siguiente</span>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
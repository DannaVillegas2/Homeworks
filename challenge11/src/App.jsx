import { useEffect, useMemo, useState } from "react";
import { Graph } from "react-d3-graph";
import { GrafoSocial } from "./structures/GrafoSocial";
import "./App.css";

const STORAGE_KEY = "challenge11-socialgraph";

// Configuración visual de react-d3-graph
const graphConfig = {
  directed: false,
  nodeHighlightBehavior: true,
  width: 850,
  height: 500,
  panAndZoom: true,
  d3: {
    gravity: -300,
    linkLength: 160,
  },
  node: {
    labelProperty: "name",
    fontSize: 12,
    fontColor: "#334155",
    fontWeight: "bold",
    labelPosition: "bottom",
    highlightStrokeColor: "#312e81",
    highlightStrokeWidth: 3,
  },
  link: {
    strokeWidth: 2,
    renderLabel: true,
    fontSize: 10,
    fontColor: "#64748b",
  },
};

// Grafo inicial de ejemplo
function crearEjemplo() {
  const grafo = new GrafoSocial();

  const cali = grafo.agregarCiudad("Cali");
  const bogota = grafo.agregarCiudad("Bogotá");
  const medellin = grafo.agregarCiudad("Medellín");

  const ana = grafo.agregarPersona("Ana", 21, cali);
  const luis = grafo.agregarPersona("Luis", 23, cali);
  const sofia = grafo.agregarPersona("Sofía", 22, bogota);
  const mateo = grafo.agregarPersona("Mateo", 24, medellin);

  grafo.agregarAmistad(ana, luis);
  grafo.agregarAmistad(ana, sofia);
  grafo.agregarAmistad(luis, mateo);

  return grafo;
}

// Recuperar los datos guardados
function cargarGrafo() {
  try {
    const datos = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (
      datos &&
      Array.isArray(datos.nodos) &&
      Array.isArray(datos.aristas)
    ) {
      const grafo = new GrafoSocial();
      grafo.nodos = datos.nodos;
      grafo.aristas = datos.aristas;
      return grafo;
    }
  } catch {
    // Si no hay datos válidos, utilizar el ejemplo
  }

  return crearEjemplo();
}

function App() {
  const [grafo, setGrafo] = useState(cargarGrafo);

  const [nombreCiudad, setNombreCiudad] = useState("");
  const [nombrePersona, setNombrePersona] = useState("");
  const [edad, setEdad] = useState("");
  const [ciudadPersona, setCiudadPersona] = useState("");

  const [amigo1, setAmigo1] = useState("");
  const [amigo2, setAmigo2] = useState("");

  const [ciudadConsulta, setCiudadConsulta] = useState("");
  const [nodoSeleccionado, setNodoSeleccionado] = useState("");
  const [error, setError] = useState("");

  // Guardar el grafo en el navegador
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grafo));
  }, [grafo]);

  const ciudades = grafo.nodos.filter(
    (nodo) => nodo.tipo === "ciudad"
  );

  const personas = grafo.nodos.filter(
    (nodo) => nodo.tipo === "persona"
  );

  const amistades = grafo.aristas.filter(
    (arista) => arista.tipo === "amistad"
  );

  const ciudadActual =
    ciudades.find((c) => c.id === ciudadConsulta) ||
    ciudades[0];

  const habitantes = ciudadActual
    ? grafo.obtenerPersonasPorCiudad(ciudadActual.id)
    : [];

  const seleccionado = grafo.nodos.find(
    (nodo) => nodo.id === nodoSeleccionado
  );

  const obtenerNombre = (id) =>
    grafo.nodos.find((nodo) => nodo.id === id)?.nombre ||
    "Desconocido";

  // Convertir nodos y aristas al formato de react-d3-graph
  const datosGrafico = useMemo(() => {
    return {
      nodes: grafo.nodos.map((nodo) => ({
        id: nodo.id,
        name:
          nodo.tipo === "persona"
            ? `${nodo.nombre} (${nodo.edad} años)`
            : nodo.nombre,
        color:
          nodo.tipo === "persona" ? "#6366f1" : "#f59e0b",
        symbolType:
          nodo.tipo === "persona" ? "circle" : "square",
        size: nodo.tipo === "persona" ? 450 : 600,
      })),
      links: grafo.aristas.map((arista) => ({
        source: arista.source,
        target: arista.target,
        label:
          arista.tipo === "amistad" ? "Amigos" : "Vive en",
        color:
          arista.tipo === "amistad" ? "#16a34a" : "#94a3b8",
      })),
    };
  }, [grafo]);

  // Crear una copia para actualizar React correctamente
  const modificarGrafo = (operacion) => {
    try {
      const copia = new GrafoSocial();

      copia.nodos = grafo.nodos.map((nodo) => ({ ...nodo }));
      copia.aristas = grafo.aristas.map(
        (arista) => ({ ...arista })
      );

      operacion(copia);

      setGrafo(copia);
      setError("");
      return true;
    } catch (err) {
      setError(err.message || "Ocurrió un error.");
      return false;
    }
  };

  // Agregar ciudad
  const crearCiudad = (e) => {
    e.preventDefault();

    const nombre = nombreCiudad.trim();

    if (!nombre) {
      setError("Escribe el nombre de la ciudad.");
      return;
    }

    if (
      ciudades.some(
        (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
      )
    ) {
      setError("Esa ciudad ya existe.");
      return;
    }

    const exito = modificarGrafo((g) => g.agregarCiudad(nombre));

    if (exito) setNombreCiudad("");
  };

  // Agregar persona
  const crearPersona = (e) => {
    e.preventDefault();

    const nombre = nombrePersona.trim();
    const numeroEdad = Number(edad);

    if (!nombre || !Number.isInteger(numeroEdad) ||
        numeroEdad < 1 || numeroEdad > 120) {
      setError("Ingresa un nombre y una edad válida.");
      return;
    }

    const exito = modificarGrafo((g) =>
      g.agregarPersona(nombre, numeroEdad, ciudadPersona)
    );

    if (exito) {
      setNombrePersona("");
      setEdad("");
      setCiudadPersona("");
    }
  };

  // Crear amistad
  const crearAmistad = (e) => {
    e.preventDefault();

    modificarGrafo((g) => g.agregarAmistad(amigo1, amigo2));
  };

  // Cambiar la residencia de una persona
  const cambiarCiudad = (personaId, nuevaCiudadId) => {
    modificarGrafo((g) => {
      const residencia = g.aristas.find(
        (a) =>
          a.tipo === "residencia" &&
          a.source === personaId
      );

      if (!residencia) {
        throw new Error("No se encontró la residencia.");
      }

      residencia.target = nuevaCiudadId;
    });
  };

  // Eliminar un nodo
  const eliminarNodo = (id) => {
    const nodo = grafo.nodos.find((n) => n.id === id);

    if (
      nodo?.tipo === "ciudad" &&
      grafo.obtenerPersonasPorCiudad(id).length > 0
    ) {
      setError(
        "No puedes eliminar una ciudad con habitantes. " +
        "Primero cambia su residencia."
      );
      return;
    }

    if (!window.confirm("¿Deseas eliminar este nodo?")) return;

    const exito = modificarGrafo((g) => g.eliminarNodo(id));

    if (exito) setNodoSeleccionado("");
  };

  // Eliminar una amistad
  const eliminarAmistad = (origen, destino) => {
    modificarGrafo((g) => {
      g.aristas = g.aristas.filter(
        (a) =>
          !(
            a.tipo === "amistad" &&
            a.source === origen &&
            a.target === destino
          )
      );
    });
  };

  const reiniciar = () => {
    if (!window.confirm("¿Restablecer el grafo de ejemplo?")) {
      return;
    }

    setGrafo(crearEjemplo());
    setCiudadConsulta("");
    setNodoSeleccionado("");
    setError("");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>SocialGraph</h1>
          <p>Challenge 11 | Grafo de amigos y ciudades</p>
        </div>

        <button
          className="btn-secondary"
          onClick={reiniciar}
        >
          Restablecer ejemplo
        </button>
      </header>

      <main className="layout">
        <aside className="panel sidebar">
          <h2>Gestionar grafo</h2>

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <section>
            <h3>Agregar ciudad</h3>

            <form onSubmit={crearCiudad}>
              <input
                type="text"
                placeholder="Ej. Barranquilla"
                value={nombreCiudad}
                onChange={(e) =>
                  setNombreCiudad(e.target.value)
                }
                required
              />

              <button type="submit">
                + Agregar ciudad
              </button>
            </form>
          </section>

          <section>
            <h3>Agregar persona</h3>

            <form onSubmit={crearPersona}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombrePersona}
                onChange={(e) =>
                  setNombrePersona(e.target.value)
                }
                required
              />

              <input
                type="number"
                min="1"
                max="120"
                placeholder="Edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                required
              />

              <select
                value={ciudadPersona}
                onChange={(e) =>
                  setCiudadPersona(e.target.value)
                }
                required
              >
                <option value="">Selecciona una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={ciudades.length === 0}
              >
                + Agregar persona
              </button>
            </form>
          </section>

          <section>
            <h3>Crear amistad</h3>

            <form onSubmit={crearAmistad}>
              <select
                value={amigo1}
                onChange={(e) => setAmigo1(e.target.value)}
                required
              >
                <option value="">Primera persona</option>
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.nombre}
                  </option>
                ))}
              </select>

              <select
                value={amigo2}
                onChange={(e) => setAmigo2(e.target.value)}
                required
              >
                <option value="">Segunda persona</option>
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.nombre}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={personas.length < 2}
              >
                Conectar amigos
              </button>
            </form>
          </section>
        </aside>

        <div className="content">
          <section className="panel">
            <div className="section-header">
              <div>
                <h2>Visualización del grafo</h2>
                <p>
                  Selecciona un nodo para ver su información.
                </p>
              </div>
            </div>

            <div className="stats">
              <div>
                <strong>{personas.length}</strong>
                <span>Personas</span>
              </div>

              <div>
                <strong>{ciudades.length}</strong>
                <span>Ciudades</span>
              </div>

              <div>
                <strong>{grafo.aristas.length}</strong>
                <span>Relaciones</span>
              </div>
            </div>

            <div className="legend">
              <span>
                <i className="person-dot" /> Persona
              </span>
              <span>
                <i className="city-dot" /> Ciudad
              </span>
              <span>
                <i className="friend-line" /> Amistad
              </span>
            </div>

            <div className="graph-container">
              {datosGrafico.nodes.length > 0 ? (
                <Graph
                  id="socialgraph"
                  data={datosGrafico}
                  config={graphConfig}
                  onClickNode={(id) =>
                    setNodoSeleccionado(id)
                  }
                />
              ) : (
                <p>Agrega personas o ciudades al grafo.</p>
              )}
            </div>

            {seleccionado && (
              <div className="selected-node">
                <div>
                  <h3>{seleccionado.nombre}</h3>
                  <p>
                    {seleccionado.tipo === "persona"
                      ? `Persona, ${seleccionado.edad} años`
                      : "Ciudad"}
                  </p>
                </div>

                {seleccionado.tipo === "persona" && (
                  <label>
                    Ciudad donde vive
                    <select
                      value={
                        grafo.aristas.find(
                          (a) =>
                            a.tipo === "residencia" &&
                            a.source === seleccionado.id
                        )?.target || ""
                      }
                      onChange={(e) =>
                        cambiarCiudad(
                          seleccionado.id,
                          e.target.value
                        )
                      }
                    >
                      {ciudades.map((ciudad) => (
                        <option
                          key={ciudad.id}
                          value={ciudad.id}
                        >
                          {ciudad.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <button
                  className="btn-danger"
                  onClick={() =>
                    eliminarNodo(seleccionado.id)
                  }
                >
                  Eliminar nodo
                </button>
              </div>
            )}
          </section>

          <section className="panel">
            <h2>Personas que viven en una ciudad</h2>
            <p>
              Selecciona una ciudad para consultar sus habitantes.
            </p>

            <select
              className="city-select"
              value={ciudadActual?.id || ""}
              onChange={(e) =>
                setCiudadConsulta(e.target.value)
              }
            >
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.nombre}
                </option>
              ))}
            </select>

            <h3>
              Habitantes de{" "}
              {ciudadActual?.nombre || "la ciudad"}
            </h3>

            {habitantes.length === 0 ? (
              <p>No hay personas registradas aquí.</p>
            ) : (
              <div className="resident-list">
                {habitantes.map((persona) => (
                  <div
                    className="resident"
                    key={persona.id}
                  >
                    <div className="resident-avatar">
                      {persona.nombre.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{persona.nombre}</strong>
                      <small>{persona.edad} años</small>
                    </div>

                    <button
                      className="btn-secondary"
                      onClick={() =>
                        setNodoSeleccionado(persona.id)
                      }
                    >
                      Ver nodo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <h2>Amistades registradas</h2>

            {amistades.length === 0 ? (
              <p>Todavía no hay amistades registradas.</p>
            ) : (
              <div className="friend-list">
                {amistades.map((amistad) => (
                  <div
                    className="friend-item"
                    key={`${amistad.source}-${amistad.target}`}
                  >
                    <span>
                      {obtenerNombre(amistad.source)}
                      {" — "}
                      {obtenerNombre(amistad.target)}
                    </span>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        eliminarAmistad(
                          amistad.source,
                          amistad.target
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
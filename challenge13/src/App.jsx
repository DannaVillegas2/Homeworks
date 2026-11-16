
import { useEffect, useRef, useState } from "react";
import { buscarGifs } from "./services/giphyService";
import "./App.css";

function App() {
  const [busqueda, setBusqueda] = useState("");
  const [terminoBuscado, setTerminoBuscado] = useState("");
  const [gifs, setGifs] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [haBuscado, setHaBuscado] = useState(false);

  const controladorRef = useRef(null);

  // Cancelar solicitudes pendientes al salir
  useEffect(() => {
    return () => {
      controladorRef.current?.abort();
    };
  }, []);

  // Buscar GIFs utilizando nuestra API
  const realizarBusqueda = async (e) => {
    e.preventDefault();

    const termino = busqueda.trim();

    if (!termino) {
      setError("Escribe una palabra para buscar GIFs.");
      return;
    }

    // Cancelar una búsqueda anterior
    controladorRef.current?.abort();

    const controlador = new AbortController();
    controladorRef.current = controlador;

    setCargando(true);
    setError("");
    setGifs([]);
    setTerminoBuscado(termino);
    setHaBuscado(true);

    try {
      const resultados = await buscarGifs(termino, {
        limit: 25,
        offset: 0,
        rating: "g",
        lang: "es",
        signal: controlador.signal,
      });

      if (!controlador.signal.aborted) {
        setGifs(resultados);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      if (!controlador.signal.aborted) {
        setCargando(false);
      }
    }
  };

  return (
    <div className="app">
      {/* ENCABEZADO */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">GIF</span>
            <h1>GiphySearch</h1>
          </div>

          <p>Challenge 13 | React + GIPHY API</p>
        </div>
      </header>

      <main className="container">
        {/* PRESENTACIÓN */}
        <section className="hero">
          <h2>Encuentra el GIF perfecto</h2>

          <p>
            Busca miles de GIFs animados utilizando
            la API de GIPHY.
          </p>

          {/* FORMULARIO */}
          <form
            className="search-form"
            onSubmit={realizarBusqueda}
          >
            <input
              type="text"
              placeholder="Busca GIFs: smile, gatos, fútbol..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              aria-label="Buscar GIFs"
            />

            <button
              type="submit"
              disabled={cargando || !busqueda.trim()}
            >
              {cargando ? "Buscando..." : "Buscar GIFs"}
            </button>
          </form>

          <div className="search-examples">
            <span>Prueba buscando:</span>

            {["smile", "cats", "love", "dance"].map(
              (palabra) => (
                <button
                  type="button"
                  key={palabra}
                  onClick={() => setBusqueda(palabra)}
                >
                  {palabra}
                </button>
              )
            )}
          </div>
        </section>

        {/* RESULTADOS */}
        <section className="results-section">
          <div className="results-header">
            <div>
              <h2>Resultados de búsqueda</h2>

              {haBuscado && (
                <p>
                  Buscando: <strong>{terminoBuscado}</strong>
                </p>
              )}
            </div>

            {gifs.length > 0 && (
              <span className="results-count">
                {gifs.length} GIFs encontrados
              </span>
            )}
          </div>

          {/* ERRORES */}
          {error && (
            <div className="error-message" role="alert">
              <p>{error}</p>
            </div>
          )}

          {/* CARGANDO */}
          {cargando && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Buscando los mejores GIFs...</p>
            </div>
          )}

          {/* PANTALLA INICIAL */}
          {!haBuscado && !cargando && (
            <div className="empty-state">
              <div className="empty-icon">GIF</div>

              <h3>¿Qué GIF estás buscando?</h3>

              <p>
                Escribe una palabra en el buscador
                para comenzar.
              </p>
            </div>
          )}

          {/* SIN RESULTADOS */}
          {haBuscado &&
            !cargando &&
            !error &&
            gifs.length === 0 && (
              <div className="empty-state">
                <h3>No encontramos GIFs</h3>

                <p>
                  Intenta buscar otra palabra.
                </p>
              </div>
            )}

          {/* GALERÍA DE GIFS */}
          {!cargando && gifs.length > 0 && (
            <div className="gif-grid">
              {gifs.map((gif) => {
                const imagen =
                  gif.images?.fixed_width?.url ||
                  gif.images?.downsized?.url ||
                  gif.images?.original?.url;

                if (!imagen) return null;

                return (
                  <div className="gif-card" key={gif.id}>
                    <img
                      src={imagen}
                      alt={gif.title || "GIF animado"}
                      loading="lazy"
                    />

                    <div className="gif-info">
                      <h3>{gif.title || "GIF sin título"}</h3>

                      <a
                        href={gif.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver en GIPHY
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <p>
          Challenge 13 — Estructura de Datos y Algoritmos
        </p>

        <a
          href="https://giphy.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by GIPHY
        </a>
      </footer>
    </div>
  );
}

export default App;

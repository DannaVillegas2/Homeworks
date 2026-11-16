import { useEffect, useMemo, useState } from "react";
import { BuscadorInteligente } from "./structures/BuscadorInteligente";
import "./App.css";

// Productos iniciales
const productosIniciales = [
  { nombre: "air max", popularidad: 90 },
  { nombre: "air force", popularidad: 95 },
  { nombre: "air jordan", popularidad: 85 },
  { nombre: "adidas boost", popularidad: 80 },
  { nombre: "adidas superstar", popularidad: 88 },
  { nombre: "nike revolution", popularidad: 75 },
  { nombre: "nike dunk", popularidad: 92 },
  { nombre: "puma suede", popularidad: 70 },
];

function cargarProductos() {
  try {
    const guardados = localStorage.getItem("challenge12-productos");

    if (guardados) {
      const datos = JSON.parse(guardados);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    console.warn("No fue posible recuperar los productos guardados.");
  }

  return productosIniciales;
}

function App() {
  const [productos, setProductos] = useState(cargarProductos);
  const [busqueda, setBusqueda] = useState("air");
  const [k, setK] = useState(2);

  const [nombre, setNombre] = useState("");
  const [popularidad, setPopularidad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Crear el buscador Trie + Heap
  const buscador = useMemo(() => {
    const nuevoBuscador = new BuscadorInteligente();

    productos.forEach((producto) => {
      nuevoBuscador.insert(
        producto.nombre,
        producto.popularidad
      );
    });

    return nuevoBuscador;
  }, [productos]);

  // Guardar productos en el navegador
  useEffect(() => {
    localStorage.setItem(
      "challenge12-productos",
      JSON.stringify(productos)
    );
  }, [productos]);

  // Obtener los productos que coinciden con el prefijo
  const coincidencias = useMemo(() => {
    return buscador.searchPrefix(busqueda);
  }, [buscador, busqueda]);

  // Obtener los K productos más populares
  const resultados = useMemo(() => {
    return buscador.searchTopK(busqueda, k);
  }, [buscador, busqueda, k]);

  // Agregar o actualizar producto
  const agregarProducto = (e) => {
    e.preventDefault();

    const nombreNormalizado = nombre
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    const popularidadNumero = Number(popularidad);

    if (!nombreNormalizado) {
      setError("Debes escribir un nombre.");
      return;
    }

    if (
      popularidad === "" ||
      !Number.isFinite(popularidadNumero) ||
      popularidadNumero < 0 ||
      popularidadNumero > 100
    ) {
      setError("La popularidad debe estar entre 0 y 100.");
      return;
    }

    const existe = productos.some(
      (p) => p.nombre === nombreNormalizado
    );

    // Usar la misma operación del Trie para validar
    try {
      buscador.trie.insert(
        nombreNormalizado,
        popularidadNumero
      );

      setProductos((anteriores) => {
        const actualizados = anteriores.filter(
          (p) => p.nombre !== nombreNormalizado
        );

        return [
          ...actualizados,
          {
            nombre: nombreNormalizado,
            popularidad: popularidadNumero,
          },
        ];
      });

      setNombre("");
      setPopularidad("");
      setError("");
      setMensaje(
        existe
          ? "Producto actualizado correctamente."
          : "Producto agregado correctamente."
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar producto
  const eliminarProducto = (nombreEliminar) => {
    if (!window.confirm(`¿Eliminar ${nombreEliminar}?`)) {
      return;
    }

    setProductos((anteriores) =>
      anteriores.filter(
        (p) => p.nombre !== nombreEliminar
      )
    );

    setMensaje("Producto eliminado correctamente.");
    setError("");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>SmartSearch</h1>
          <p>Challenge 12 | Trie + Min-Heap</p>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Motor de búsqueda inteligente</h2>
          <p>
            Encuentra productos por prefijo y descubre
            los más populares mediante estructuras de datos.
          </p>
        </section>

        <div className="dashboard">
          <section className="card search-card">
            <h2>Buscar productos</h2>

            <label htmlFor="busqueda">
              Nombre o prefijo
            </label>

            <input
              id="busqueda"
              type="text"
              placeholder="Ejemplo: air"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <label htmlFor="topk">
              ¿Cuántos productos deseas mostrar?
            </label>

            <select
              id="topk"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 10].map((numero) => (
                <option key={numero} value={numero}>
                  Top {numero}
                </option>
              ))}
            </select>

            <div className="search-info">
              <p>
                Coincidencias encontradas:
                <strong> {coincidencias.length}</strong>
              </p>

              <p>
                Resultados destacados:
                <strong> {resultados.length}</strong>
              </p>
            </div>
          </section>

          <section className="card results-card">
            <h2>Resultados destacados</h2>

            {resultados.length === 0 ? (
              <div className="empty">
                <h3>Sin resultados</h3>
                <p>
                  No encontramos productos con ese prefijo.
                </p>
              </div>
            ) : (
              <div className="results-list">
                {resultados.map((producto, index) => (
                  <div
                    className="product-result"
                    key={producto.nombre}
                  >
                    <div className="rank">
                      #{index + 1}
                    </div>

                    <div className="product-info">
                      <h3>{producto.nombre}</h3>
                      <p>Producto destacado</p>
                    </div>

                    <div className="popularity">
                      <strong>{producto.popularidad}</strong>
                      <span>Popularidad</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="dashboard">
          <section className="card">
            <h2>Agregar o actualizar producto</h2>

            <form
              onSubmit={agregarProducto}
              className="product-form"
            >
              <label>Nombre del producto</label>

              <input
                type="text"
                placeholder="Ejemplo: air zoom"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label>Popularidad (0 a 100)</label>

              <input
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="Ejemplo: 98"
                value={popularidad}
                onChange={(e) =>
                  setPopularidad(e.target.value)
                }
                required
              />

              <button type="submit" className="btn-primary">
                Guardar producto
              </button>
            </form>

            {error && <p className="error">{error}</p>}
            {mensaje && <p className="success">{mensaje}</p>}
          </section>

          <section className="card">
            <h2>Productos registrados</h2>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Popularidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.nombre}>
                      <td>{producto.nombre}</td>
                      <td>{producto.popularidad}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() =>
                            eliminarProducto(producto.nombre)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
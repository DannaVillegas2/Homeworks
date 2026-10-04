import { useRef, useState } from "react";
import "./App.css";
import PilaLibros from "./structures/PilaLibros";
import librosPrueba from "./data/librosPrueba";

function App() {
  const pilaRef = useRef(null);

  if (pilaRef.current === null) {
    pilaRef.current = new PilaLibros();

    librosPrueba.forEach((libro) => {
      pilaRef.current.push(libro);
    });
  }

  const [libros, setLibros] = useState(pilaRef.current.getLibros());

  const [formulario, setFormulario] = useState({
    titulo: "",
    isbn: "",
    autor: "",
    editorial: "",
  });

  const actualizarPila = () => {
    setLibros(pilaRef.current.getLibros());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoLibro = {
      titulo: formulario.titulo.trim(),
      isbn: formulario.isbn.trim(),
      autor: formulario.autor.trim(),
      editorial: formulario.editorial.trim(),
    };

    if (
      !nuevoLibro.titulo ||
      !nuevoLibro.isbn ||
      !nuevoLibro.autor ||
      !nuevoLibro.editorial
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    pilaRef.current.push(nuevoLibro);

    actualizarPila();

    setFormulario({
      titulo: "",
      isbn: "",
      autor: "",
      editorial: "",
    });
  };

  const retirarLibro = () => {
    if (pilaRef.current.isEmpty()) {
      alert("La pila está vacía.");
      return;
    }

    const libroEliminado = pilaRef.current.pop();

    alert(`Se retiró: ${libroEliminado.titulo}`);

    actualizarPila();
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="challenge">Challenge 04</p>
          <h1>Pila de Libros</h1>
          <p>Gestión de libros usando una estructura tipo pila LIFO.</p>
        </div>

        <div className="contador">
          <span>{libros.length}</span>
          <p>Libros</p>
        </div>
      </header>

      <main className="contenido">
        <section className="panel">
          <h2>Agregar libro</h2>

          <form onSubmit={handleSubmit}>
            <div className="campo">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={formulario.titulo}
                onChange={handleChange}
                placeholder="Título del libro"
              />
            </div>

            <div className="campo">
              <label>ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formulario.isbn}
                onChange={handleChange}
                placeholder="ISBN"
              />
            </div>

            <div className="campo">
              <label>Autor</label>
              <input
                type="text"
                name="autor"
                value={formulario.autor}
                onChange={handleChange}
                placeholder="Autor"
              />
            </div>

            <div className="campo">
              <label>Editorial</label>
              <input
                type="text"
                name="editorial"
                value={formulario.editorial}
                onChange={handleChange}
                placeholder="Editorial"
              />
            </div>

            <button type="submit" className="btn-agregar">
              Agregar a la pila
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="pila-header">
            <div>
              <h2>Pila de libros</h2>
              <p>El libro más reciente aparece en la cima.</p>
            </div>

            <button
              className="btn-eliminar"
              onClick={retirarLibro}
              disabled={libros.length === 0}
            >
              Retirar de la cima
            </button>
          </div>

          <div className="pila">
            {libros.length === 0 ? (
              <p>No hay libros en la pila.</p>
            ) : (
              libros.map((libro, index) => (
                <div
                  className={`libro ${index === 0 ? "libro-cima" : ""}`}
                  key={`${libro.isbn}-${index}`}
                >
                  <div className="posicion">
                    {index === 0 ? "CIMA" : `#${index + 1}`}
                  </div>

                  <div>
                    <h3>{libro.titulo}</h3>
                    <p>
                      <strong>ISBN:</strong> {libro.isbn}
                    </p>
                    <p>
                      <strong>Autor:</strong> {libro.autor}
                    </p>
                    <p>
                      <strong>Editorial:</strong> {libro.editorial}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {libros.length > 0 && (
            <div className="info-cima">
              <strong>Libro en la cima:</strong>{" "}
              {pilaRef.current.peek()?.titulo}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
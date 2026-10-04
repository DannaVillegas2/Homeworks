import Navbar from "../components/Navbar";

function ExerciseTwoPage() {
  return (
    <>
      <Navbar />

      <main className="private-page">
        <div className="exercise-card">
          <span className="exercise-number">Ejercicio 2</span>

          <h1>Segundo ejercicio</h1>

          <p>
            Esta es la segunda página privada de la aplicación.
          </p>

          <div className="exercise-content">
            <h2>Contenido del ejercicio</h2>
            <p>
              Aquí se mostrará el segundo ejercicio correspondiente al reto
              anterior.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default ExerciseTwoPage;
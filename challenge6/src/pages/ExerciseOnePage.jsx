import Navbar from "../components/Navbar";

function ExerciseOnePage() {
  return (
    <>
      <Navbar />

      <main className="private-page">
        <div className="exercise-card">
          <span className="exercise-number">Ejercicio 1</span>

          <h1>Primer ejercicio</h1>

          <p>
            Esta es una página privada. Solo puede visualizarse cuando el
            usuario ha iniciado sesión correctamente.
          </p>

          <div className="exercise-content">
            <h2>Contenido del ejercicio</h2>
            <p>
              Aquí se mostrará el primer ejercicio correspondiente al reto
              anterior.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default ExerciseOnePage;
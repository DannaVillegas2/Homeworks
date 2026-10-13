const generarFechaAleatoria = () => {
  const ahora = new Date();

  const minutosAleatorios = Math.floor(Math.random() * 120);

  return new Date(
    ahora.getTime() - minutosAleatorios * 60 * 1000
  ).toISOString();
};

const personasPrueba = [
  {
    id: 1,
    nombre: "Carlos Gómez",
    montoRetiro: 200000,
    fechaLlegada: generarFechaAleatoria(),
  },
  {
    id: 2,
    nombre: "Laura Martínez",
    montoRetiro: 500000,
    fechaLlegada: generarFechaAleatoria(),
  },
  {
    id: 3,
    nombre: "Andrés Pérez",
    montoRetiro: 150000,
    fechaLlegada: generarFechaAleatoria(),
  },
  {
    id: 4,
    nombre: "Valentina Rodríguez",
    montoRetiro: 300000,
    fechaLlegada: generarFechaAleatoria(),
  },
];

export default personasPrueba;
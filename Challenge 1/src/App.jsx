import { useEffect, useState } from "react";
import "./App.css";
import Loader from "./components/Loader";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const contactosIniciales = [
        {
          id: 1,
          nombre: "Danna Villegas",
          telefono: "3001234567",
        },
        {
          id: 2,
          nombre: "Luciana Vargas",
          telefono: "3157654321",
        },
        {
          id: 3,
          nombre: "Angie Ilamo",
          telefono: "3109876543",
        },
      ];

      setContactos(contactosIniciales);
      setCargando(false);
    }, 2000);
  }, []);

  const agregarContacto = (nuevoContacto) => {
    const contacto = {
      id: Date.now(),
      ...nuevoContacto,
    };

    setContactos([...contactos, contacto]);
  };

  const eliminarContacto = (id) => {
    setContactos(
      contactos.filter((contacto) => contacto.id !== id)
    );
  };

  if (cargando) {
    return <Loader />;
  }

  return (
  <div className="contenedor">
    <h1>Mis contactos</h1>

    <ContactForm onAgregar={agregarContacto} />

    <ContactList
      contactos={contactos}
      onEliminar={eliminarContacto}
    />
  </div>
);
}

export default App;
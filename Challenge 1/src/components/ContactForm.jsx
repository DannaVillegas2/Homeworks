import { useState } from "react";

function ContactForm({ onAgregar }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (nombre.trim() === "" || telefono.trim() === "") {
      return;
    }

    onAgregar({
      nombre,
      telefono,
    });

    setNombre("");
    setTelefono("");
  };

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <div className="campo">
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="campo">
        <label>Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <button type="submit">Agregar contacto</button>
    </form>
  );
}

export default ContactForm;
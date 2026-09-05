function Contact({ nombre, telefono, onEliminar }) {
  return (
    <div className="contacto">
      <p>
        <strong>Nombre:</strong> {nombre}
      </p>

      <p>
        <strong>Teléfono:</strong> {telefono}
      </p>

      <button onClick={onEliminar}>Eliminar</button>
    </div>
  );
}

export default Contact;
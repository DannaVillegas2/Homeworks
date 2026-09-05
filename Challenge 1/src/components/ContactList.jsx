import Contact from "./Contact";

function ContactList({ contactos, onEliminar }) {
  return (
    <div>
      <h2>Lista de contactos</h2>

      <div className="lista-contactos">
        {contactos.map((contacto) => (
          <Contact
            key={contacto.id}
            nombre={contacto.nombre}
            telefono={contacto.telefono}
            onEliminar={() => onEliminar(contacto.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default ContactList;
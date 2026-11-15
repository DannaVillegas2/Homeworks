export class GrafoSocial {
  constructor() {
    this.nodos = [];
    this.aristas = [];
  }

  agregarCiudad(nombre) {
    const id = crypto.randomUUID();

    const ciudad = {
      id,
      nombre,
      tipo: "ciudad",
    };

    this.nodos.push(ciudad);
    return id;
  }

  agregarPersona(nombre, edad, ciudadId) {
    const ciudad = this.nodos.find(
      (nodo) => nodo.id === ciudadId && nodo.tipo === "ciudad"
    );

    if (!ciudad) {
      throw new Error("La ciudad seleccionada no existe");
    }

    const id = crypto.randomUUID();

    const persona = {
      id,
      nombre,
      edad: Number(edad),
      tipo: "persona",
    };

    this.nodos.push(persona);

    this.aristas.push({
      source: id,
      target: ciudadId,
      tipo: "residencia",
    });

    return id;
  }

  agregarAmistad(persona1, persona2) {
    if (persona1 === persona2) {
      throw new Error("Una persona no puede ser amiga de sí misma");
    }

    const personasValidas = [persona1, persona2].every((id) =>
      this.nodos.some(
        (nodo) => nodo.id === id && nodo.tipo === "persona"
      )
    );

    if (!personasValidas) {
      throw new Error("Selecciona dos personas válidas");
    }

    const existe = this.aristas.some(
      (arista) =>
        arista.tipo === "amistad" &&
        ((arista.source === persona1 &&
          arista.target === persona2) ||
          (arista.source === persona2 &&
            arista.target === persona1))
    );

    if (existe) {
      throw new Error("La amistad ya existe");
    }

    this.aristas.push({
      source: persona1,
      target: persona2,
      tipo: "amistad",
    });
  }

  obtenerPersonasPorCiudad(ciudadId) {
    const residentes = this.aristas
      .filter(
        (arista) =>
          arista.tipo === "residencia" &&
          arista.target === ciudadId
      )
      .map((arista) => arista.source);

    return this.nodos.filter(
      (nodo) =>
        nodo.tipo === "persona" &&
        residentes.includes(nodo.id)
    );
  }

  eliminarNodo(id) {
    this.nodos = this.nodos.filter(
      (nodo) => nodo.id !== id
    );

    this.aristas = this.aristas.filter(
      (arista) =>
        arista.source !== id && arista.target !== id
    );
  }

  obtenerDatosGrafo() {
    return {
      nodes: this.nodos.map((nodo) => ({
        id: nodo.id,
        nombre: nodo.nombre,
        edad: nodo.edad,
        tipo: nodo.tipo,
      })),

      links: this.aristas.map((arista) => ({
        source: arista.source,
        target: arista.target,
        tipo: arista.tipo,
      })),
    };
  }
}
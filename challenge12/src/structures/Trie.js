class NodoTrie {
  constructor() {
    this.hijos = new Map();
    this.producto = null;
  }
}

export class Trie {
  constructor() {
    this.raiz = new NodoTrie();
  }

  // Normalizar nombres para facilitar las búsquedas
  normalizar(texto) {
    return texto.trim().toLowerCase().replace(/\s+/g, " ");
  }

  // INSERTAR PRODUCTO
  insert(nombre, popularidad) {
    nombre = this.normalizar(nombre);
    popularidad = Number(popularidad);

    if (!nombre) {
      throw new Error("El nombre no puede estar vacío.");
    }

    if (
      !Number.isFinite(popularidad) ||
      popularidad < 0 ||
      popularidad > 100
    ) {
      throw new Error("La popularidad debe estar entre 0 y 100.");
    }

    let nodoActual = this.raiz;

    for (const letra of nombre) {
      if (!nodoActual.hijos.has(letra)) {
        nodoActual.hijos.set(letra, new NodoTrie());
      }

      nodoActual = nodoActual.hijos.get(letra);
    }

    // Si existe, actualizar la popularidad
    nodoActual.producto = {
      nombre,
      popularidad,
    };
  }

  // BUSCAR PRODUCTOS POR PREFIJO
  searchPrefix(prefijo) {
    prefijo = this.normalizar(prefijo);

    let nodoActual = this.raiz;

    // Recorrer las letras del prefijo
    for (const letra of prefijo) {
      if (!nodoActual.hijos.has(letra)) {
        return [];
      }

      nodoActual = nodoActual.hijos.get(letra);
    }

    const resultados = [];

    // Recorrer los descendientes del prefijo
    const recorrer = (nodo) => {
      if (nodo.producto !== null) {
        resultados.push({ ...nodo.producto });
      }

      for (const hijo of nodo.hijos.values()) {
        recorrer(hijo);
      }
    };

    recorrer(nodoActual);

    return resultados;
  }

  // ELIMINAR PRODUCTO
  remove(nombre) {
    nombre = this.normalizar(nombre);

    let nodoActual = this.raiz;
    const camino = [];

    for (const letra of nombre) {
      if (!nodoActual.hijos.has(letra)) {
        return false;
      }

      camino.push([nodoActual, letra]);
      nodoActual = nodoActual.hijos.get(letra);
    }

    if (nodoActual.producto === null) {
      return false;
    }

    nodoActual.producto = null;

    // Eliminar nodos que ya no se utilizan
    for (let i = camino.length - 1; i >= 0; i--) {
      if (
        nodoActual.producto !== null ||
        nodoActual.hijos.size > 0
      ) {
        break;
      }

      const [padre, letra] = camino[i];
      padre.hijos.delete(letra);
      nodoActual = padre;
    }

    return true;
  }

  // OBTENER TODOS LOS PRODUCTOS
  getAll() {
    return this.searchPrefix("");
  }
}
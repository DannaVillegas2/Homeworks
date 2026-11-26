export function normalizar(texto) {
  return texto.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

class NodoTrie {
  hijos = new Map();
  titulo = null;
}

export class Trie {
  raiz = new NodoTrie();

  insertar(titulo) {
    const clave = normalizar(titulo);
    if (!clave) return;
    let nodo = this.raiz;
    for (const letra of clave) {
      if (!nodo.hijos.has(letra)) nodo.hijos.set(letra, new NodoTrie());
      nodo = nodo.hijos.get(letra);
    }
    nodo.titulo = titulo.trim();
  }

  buscarNodo(texto) {
    let nodo = this.raiz;
    for (const letra of normalizar(texto)) {
      nodo = nodo.hijos.get(letra);
      if (!nodo) break;
    }
    return nodo;
  }

  existe(titulo) {
    return Boolean(this.buscarNodo(titulo)?.titulo);
  }

  sugerencias(prefijo) {
    const inicio = this.buscarNodo(prefijo);
    if (!inicio) return [];
    const pendientes = [inicio];
    const titulos = [];
    while (pendientes.length) {
      const nodo = pendientes.pop();
      if (nodo.titulo) titulos.push(nodo.titulo);
      pendientes.push(...nodo.hijos.values());
    }
    return titulos.sort((a, b) => a.localeCompare(b, 'es'));
  }
}

function prioridad(a, b) {
  return a.escuchas - b.escuchas || b.titulo.localeCompare(a.titulo, 'es');
}

export class MaxHeap {
  datos = [];

  insertar(cancion) {
    const datos = this.datos;
    let i = datos.length;
    datos.push(cancion);
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (prioridad(datos[padre], cancion) >= 0) break;
      datos[i] = datos[padre];
      i = padre;
    }
    datos[i] = cancion;
  }

  extraerMaximo() {
    const datos = this.datos;
    const maximo = datos[0];
    const ultimo = datos.pop();
    if (!datos.length) return maximo;
    let i = 0;
    while (2 * i + 1 < datos.length) {
      let hijo = 2 * i + 1;
      if (hijo + 1 < datos.length && prioridad(datos[hijo + 1], datos[hijo]) > 0) hijo++;
      if (prioridad(ultimo, datos[hijo]) >= 0) break;
      datos[i] = datos[hijo];
      i = hijo;
    }
    datos[i] = ultimo;
    return maximo;
  }
}

export class Grafo {
  vecinos = new Map();

  agregar(titulo) {
    if (!this.vecinos.has(titulo)) this.vecinos.set(titulo, new Set());
  }

  conectar(a, b) {
    this.agregar(a);
    this.agregar(b);
    if (a === b) return;
    this.vecinos.get(a).add(b);
    this.vecinos.get(b).add(a);
  }

  relacionadas(titulo) {
    return [...(this.vecinos.get(titulo) ?? [])];
  }
}

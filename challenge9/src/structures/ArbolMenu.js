export class NodoMenu {
  constructor(titulo, link, componente) {
    this.titulo = titulo;
    this.link = link;
    this.componente = componente;
    this.hijos = [];
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo);
  }
}

export class ArbolMenu {
  constructor(raiz) {
    this.raiz = raiz;
  }

  obtenerRaiz() {
    return this.raiz;
  }
}
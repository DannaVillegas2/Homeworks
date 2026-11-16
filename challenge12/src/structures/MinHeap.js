export class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Comparar productos por popularidad
  comparar(a, b) {
    if (a.popularidad !== b.popularidad) {
      return a.popularidad - b.popularidad;
    }

    // En caso de empate, ordenar alfabéticamente
    return b.nombre.localeCompare(a.nombre);
  }

  // Obtener cantidad de elementos
  size() {
    return this.heap.length;
  }

  // Consultar el elemento mínimo
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // INSERTAR PRODUCTO
  insert(producto) {
    this.heap.push({ ...producto });
    this.subir(this.heap.length - 1);
  }

  // Reorganizar hacia arriba
  subir(indice) {
    while (indice > 0) {
      const padre = Math.floor((indice - 1) / 2);

      if (
        this.comparar(
          this.heap[indice],
          this.heap[padre]
        ) >= 0
      ) {
        break;
      }

      [this.heap[indice], this.heap[padre]] = [
        this.heap[padre],
        this.heap[indice],
      ];

      indice = padre;
    }
  }

  // EXTRAER EL PRODUCTO MENOS POPULAR
  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }

    const minimo = this.heap[0];
    const ultimo = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = ultimo;
      this.bajar(0);
    }

    return minimo;
  }

  // Reorganizar hacia abajo
  bajar(indice) {
    const n = this.heap.length;

    while (true) {
      let menor = indice;
      const izquierdo = 2 * indice + 1;
      const derecho = 2 * indice + 2;

      if (
        izquierdo < n &&
        this.comparar(
          this.heap[izquierdo],
          this.heap[menor]
        ) < 0
      ) {
        menor = izquierdo;
      }

      if (
        derecho < n &&
        this.comparar(
          this.heap[derecho],
          this.heap[menor]
        ) < 0
      ) {
        menor = derecho;
      }

      if (menor === indice) {
        break;
      }

      [this.heap[indice], this.heap[menor]] = [
        this.heap[menor],
        this.heap[indice],
      ];

      indice = menor;
    }
  }

  // devolver productor de mayor a menor popularidad
  getSortedDescending() {
    const copia = new MinHeap();
    copia.heap = this.heap.map((producto) => ({
      ...producto,
    }));

    const resultado = [];

    while (copia.size() > 0) {
      resultado.push(copia.extractMin());
    }

    return resultado.reverse();
  }
}
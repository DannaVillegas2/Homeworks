import { Trie } from "./Trie.js";
import { MinHeap } from "./MinHeap.js";

export class BuscadorInteligente {
  constructor() {
    this.trie = new Trie();
  }

  // INSERTAR O ACTUALIZAR PRODUCTO
  insert(nombre, popularidad) {
    this.trie.insert(nombre, popularidad);
  }

  // BUSCAR POR PREFIJO
  searchPrefix(prefijo) {
    return this.trie.searchPrefix(prefijo);
  }

  // BUSCAR LOS K PRODUCTOS MÁS POPULARES
  searchTopK(prefijo, k) {
    k = Number(k);

    if (!Number.isInteger(k) || k < 1) {
      throw new Error("K debe ser un entero mayor que cero.");
    }

    // 1. El Trie encuentra los productos del prefijo
    const productos = this.trie.searchPrefix(prefijo);

    // 2. Crear un Min-Heap
    const heap = new MinHeap();

    // 3. Mantener únicamente los mejores K productos
    for (const producto of productos) {
      if (heap.size() < k) {
        heap.insert(producto);
      } else if (
        heap.comparar(producto, heap.peek()) > 0
      ) {
        // Reemplazar el menos popular por uno mejor
        heap.extractMin();
        heap.insert(producto);
      }
    }

    // 4. Devolver los K mejores, ordenados
    return heap.getSortedDescending();
  }

  // ELIMINAR PRODUCTO
  remove(nombre) {
    return this.trie.remove(nombre);
  }

  // OBTENER TODOS LOS PRODUCTOS
  getAll() {
    return this.trie.getAll();
  }
}

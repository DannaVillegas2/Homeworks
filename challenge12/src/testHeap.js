import { MinHeap } from "./structures/MinHeap.js";

// Crear nuestro Min-Heap
const heap = new MinHeap();

// Insertar productos de prueba
heap.insert({ nombre: "air max", popularidad: 90 });
heap.insert({ nombre: "air force", popularidad: 95 });
heap.insert({ nombre: "air jordan", popularidad: 85 });
heap.insert({ nombre: "adidas boost", popularidad: 80 });

// Mostrar cantidad de productos
console.log("CANTIDAD DE PRODUCTOS:");
console.log(heap.size());

// Mostrar producto menos popular
console.log("\nPRODUCTO MENOS POPULAR:");
console.log(heap.peek());

// Mostrar todos los productos ordenados
console.log("\nPRODUCTOS ORDENADOS POR POPULARIDAD:");
console.table(heap.getSortedDescending());

// Comprobar que el Heap original se conserva
console.log("\nCANTIDAD DESPUÉS DE ORDENAR:");
console.log(heap.size());

// Extraer el producto menos popular
console.log("\nEXTRAER PRODUCTO MENOS POPULAR:");
console.log(heap.extractMin());

// Verificar nueva raíz
console.log("\nNUEVO PRODUCTO MENOS POPULAR:");
console.log(heap.peek());
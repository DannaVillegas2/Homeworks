import { BuscadorInteligente } from "./structures/BuscadorInteligente.js";

// Crear el buscador
const buscador = new BuscadorInteligente();

// Insertar productos
buscador.insert("air max", 90);
buscador.insert("air force", 95);
buscador.insert("air jordan", 85);
buscador.insert("adidas boost", 80);

// Mostrar todos los productos
console.log("PRODUCTOS REGISTRADOS:");
console.table(buscador.getAll());

// Buscar los 2 productos más populares con prefijo "air"
console.log("\nTOP 2 PRODUCTOS CON PREFIJO 'air':");
console.table(buscador.searchTopK("air", 2));

// Buscar el producto más popular
console.log("\nTOP 1 PRODUCTO CON PREFIJO 'air':");
console.table(buscador.searchTopK("air", 1));

// Buscar productos que empiezan por "adidas"
console.log("\nTOP 3 PRODUCTOS CON PREFIJO 'adidas':");
console.table(buscador.searchTopK("adidas", 3));
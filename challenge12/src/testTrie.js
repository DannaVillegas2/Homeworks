import { Trie } from "./structures/Trie.js";

const trie = new Trie();

// Insertar productos
trie.insert("air max", 90);
trie.insert("air force", 95);
trie.insert("air jordan", 85);
trie.insert("adidas boost", 80);

console.log("PRODUCTOS REGISTRADOS:");
console.table(trie.getAll());

// Buscar productos por prefijo
console.log("\nBÚSQUEDA POR PREFIJO 'air':");
console.table(trie.searchPrefix("air"));

// Buscar otro prefijo
console.log("\nBÚSQUEDA POR PREFIJO 'adidas':");
console.table(trie.searchPrefix("adidas"));

// Buscar un producto inexistente
console.log("\nBÚSQUEDA POR PREFIJO 'nike':");
console.table(trie.searchPrefix("nike"));
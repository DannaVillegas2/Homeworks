// Funciones de arreglos en JavaScript

// 1. push()
// Agrega elementos al final del arreglo.
let frutas = ["Manzana", "Pera"];
frutas.push("Mango");
console.log("push:", frutas);


// 2. pop()
// Elimina el último elemento del arreglo.
let animales = ["Perro", "Gato", "Conejo"];
animales.pop();
console.log("pop:", animales);


// 3. shift()
// Elimina el primer elemento del arreglo.
let ciudades = ["Cali", "Bogotá", "Medellín"];
ciudades.shift();
console.log("shift:", ciudades);


// 4. unshift()
// Agrega elementos al inicio del arreglo.
let numeros = [2, 3, 4];
numeros.unshift(1);
console.log("unshift:", numeros);


// 5. concat()
// Une dos arreglos.
let frutas1 = ["Manzana", "Pera"];
let frutas2 = ["Mango", "Banano"];
let todasLasFrutas = frutas1.concat(frutas2);
console.log("concat:", todasLasFrutas);


// 6. slice()
// Extrae una parte del arreglo sin modificar el original.
let numerosSlice = [10, 20, 30, 40, 50];
let parteNumeros = numerosSlice.slice(1, 4);
console.log("slice:", parteNumeros);


// 7. splice()
// Permite agregar, eliminar o reemplazar elementos.
let frutasSplice = ["Manzana", "Pera", "Banano"];
frutasSplice.splice(1, 1, "Mango");
console.log("splice:", frutasSplice);


// 8. includes()
// Comprueba si un elemento existe en el arreglo.
let lenguajes = ["JavaScript", "Python", "Java"];
console.log("includes:", lenguajes.includes("JavaScript"));


// 9. indexOf()
// Busca la posición de un elemento.
let animalesIndex = ["Perro", "Gato", "Pájaro"];
console.log("indexOf:", animalesIndex.indexOf("Gato"));


// 10. lastIndexOf()
// Busca la última posición de un elemento.
let numerosRepetidos = [10, 20, 30, 20, 40];
console.log("lastIndexOf:", numerosRepetidos.lastIndexOf(20));


// 11. find()
// Devuelve el primer elemento que cumple una condición.
let edades = [12, 15, 18, 21, 25];
let primeraEdadMayor = edades.find(function (edad) {
    return edad >= 18;
});
console.log("find:", primeraEdadMayor);


// 12. findIndex()
// Devuelve la posición del primer elemento que cumple una condición.
let edadesIndex = [12, 15, 18, 21, 25];
let indiceEdad = edadesIndex.findIndex(function (edad) {
    return edad >= 18;
});
console.log("findIndex:", indiceEdad);


// 13. filter()
// Crea un nuevo arreglo con los elementos que cumplen una condición.
let numerosFilter = [1, 2, 3, 4, 5, 6];
let numerosPares = numerosFilter.filter(function (numero) {
    return numero % 2 === 0;
});
console.log("filter:", numerosPares);


// 14. map()
// Crea un nuevo arreglo modificando cada elemento.
let numerosMap = [1, 2, 3, 4];
let numerosDobles = numerosMap.map(function (numero) {
    return numero * 2;
});
console.log("map:", numerosDobles);


// 15. forEach()
// Recorre todos los elementos del arreglo.
let nombres = ["Ana", "Carlos", "Laura"];
console.log("forEach:");

nombres.forEach(function (nombre) {
    console.log(nombre);
});


// 16. reduce()
// Reduce todos los elementos a un solo resultado.
let precios = [10000, 20000, 30000];
let total = precios.reduce(function (acumulador, precio) {
    return acumulador + precio;
}, 0);
console.log("reduce:", total);


// 17. reduceRight()
// Reduce los elementos comenzando desde el último.
let numerosReduceRight = [1, 2, 3, 4];
let resultadoReduceRight = numerosReduceRight.reduceRight(function (acumulador, numero) {
    return acumulador - numero;
});
console.log("reduceRight:", resultadoReduceRight);


// 18. some()
// Comprueba si al menos un elemento cumple una condición.
let edadesSome = [12, 15, 17, 20];
let hayAdultos = edadesSome.some(function (edad) {
    return edad >= 18;
});
console.log("some:", hayAdultos);


// 19. every()
// Comprueba si todos los elementos cumplen una condición.
let edadesEvery = [20, 25, 30, 40];
let todosAdultos = edadesEvery.every(function (edad) {
    return edad >= 18;
});
console.log("every:", todosAdultos);


// 20. sort()
// Ordena los elementos del arreglo.
let numerosSort = [40, 10, 30, 20];
numerosSort.sort(function (a, b) {
    return a - b;
});
console.log("sort:", numerosSort);


// 21. reverse()
// Invierte el orden de los elementos.
let letras = ["A", "B", "C", "D"];
letras.reverse();
console.log("reverse:", letras);


// 22. join()
// Une los elementos del arreglo en un texto.
let palabras = ["Hola", "mundo", "JavaScript"];
let frase = palabras.join(" ");
console.log("join:", frase);


// 23. flat()
// Convierte un arreglo con arreglos internos en uno solo.
let numerosAnidados = [1, 2, [3, 4], [5, 6]];
let numerosPlanos = numerosAnidados.flat();
console.log("flat:", numerosPlanos);


// 24. flatMap()
// Modifica los elementos y luego aplana el resultado.
let numerosFlatMap = [1, 2, 3];
let resultadoFlatMap = numerosFlatMap.flatMap(function (numero) {
    return [numero, numero * 2];
});
console.log("flatMap:", resultadoFlatMap);


// 25. at()
// Permite obtener un elemento usando su posición.
let colores = ["Rojo", "Verde", "Azul"];
console.log("at:", colores.at(1));
console.log("at con índice negativo:", colores.at(-1));


// 26. fill()
// Reemplaza elementos del arreglo por un valor.
let numerosFill = [1, 2, 3, 4, 5];
numerosFill.fill(0, 1, 4);
console.log("fill:", numerosFill);


// 27. copyWithin()
// Copia una parte del arreglo dentro del mismo arreglo.
let numerosCopyWithin = [1, 2, 3, 4, 5];
numerosCopyWithin.copyWithin(0, 3);
console.log("copyWithin:", numerosCopyWithin);


// 28. entries()
// Permite obtener los índices y valores del arreglo.
let frutasEntries = ["Manzana", "Pera", "Mango"];

console.log("entries:");
for (let entrada of frutasEntries.entries()) {
    console.log(entrada);
}


// 29. keys()
// Permite obtener los índices del arreglo.
let frutasKeys = ["Manzana", "Pera", "Mango"];

console.log("keys:");
for (let indice of frutasKeys.keys()) {
    console.log(indice);
}


// 30. values()
// Permite obtener los valores del arreglo.
let frutasValues = ["Manzana", "Pera", "Mango"];

console.log("values:");
for (let valor of frutasValues.values()) {
    console.log(valor);
}


// 31. toString()
// Convierte el arreglo en un texto.
let frutasString = ["Manzana", "Pera", "Mango"];
let textoFrutas = frutasString.toString();
console.log("toString:", textoFrutas);
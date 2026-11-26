# Frecuencia · Parcial 3
Mini plataforma educativa de música construida con React, Vite y Sass. Los títulos y artistas son ficticios. Los datos se mantienen durante la sesión y se reinician al recargar.

## Ejecutar en Visual Studio Code
Con Node.js 22.12 o posterior, abre la carpeta parcial3 y ejecuta en la terminal integrada:

```powershell
npm ci
npm run dev
```

Abre la dirección Local que muestre Vite. Para compilar, ejecuta `npm run build`.

## Recorrido de prueba
1. Escribe **Cali** para obtener dos sugerencias. Escribe **Cali al alba** para comprobar que existe el título exacto.
2. Abre **Cali de noche** y registra cinco escuchas. Pasará de 24 a 29 y ocupará el primer puesto.
3. Agrega un título y elige **Brisa del valle** como canción relacionada. Abre esa recomendación y comprueba que puedes regresar al título nuevo.
4. Intenta agregar el mismo título con mayúsculas diferentes. El panel indica que ya existe.

## Implementación
- **Trie** en `src/estructuras.js`. Cada nodo guarda sus hijos por letra. Un título completo marca el final del recorrido. La búsqueda por prefijo explora sus descendientes.
- **Max Heap** en el mismo archivo. La inserción sube cada canción hasta respetar la prioridad por escuchas. El ranking extrae hasta cinco máximos de un heap temporal. En empates se usa el orden alfabético.
- **Grafo no dirigido** en el mismo archivo. Cada arista agrega ambos títulos a sus respectivos conjuntos de vecinos.
- **Sass** en `src/panel.scss`. El panel reutiliza variables de color y un mixin para las tarjetas. La cuadrícula se adapta al ancho disponible.

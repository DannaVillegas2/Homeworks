# DEC S.A.S. — Proyecto Final Estructura de Datos

Proyecto React + Vite basado en los siete diseños originales de [Figma DEC](https://www.figma.com/design/odwDga47WDg8drgeqKDKBS/DEC-S.A.S.-%E2%80%94-Proyecto-Final-Estructura-de-Datos?node-id=0-1).

## Ejecución en Windows / VS Code

```powershell
npm install
npm run dev
```

Abre la URL que muestre Vite (normalmente http://localhost:5173/). Para comprobar:

```powershell
npm run build
npm run lint
```

## Vistas

- `/` Inicio, cuatro categorías, cuatro destacados, proceso de cotización.
- `/productos` Catálogo con filtro y buscador basado en Trie.
- `/productos/:id` Detalle y recomendaciones por grafo.
- `/carrito` Agregar, modificar, quitar y deshacer con pila.
- `/login` Inicio de sesión y registro (requiere Supabase).
- `/cotizaciones` Historial del usuario autenticado; **los registros actuales son locales**.
- `/admin` Panel con guardia de rol (`app_metadata.role === 'admin'`); muestra datos locales hasta conectar backend.
- `/vista-admin-demo` y `/vista-historial-demo`: maquetas para evaluación visual sin fingir autenticación.

## Estructuras de datos implementadas

1. **Pila** — `src/Structures/Pila.js`: snapshots del carrito para deshacer cambios (LIFO).
2. **Cola** — `src/Structures/Cola.js`: encolado FIFO de solicitudes de cotización en la demostración local.
3. **Trie** — `src/Structures/Trie.js`: índice de prefijos por palabra para búsquedas.
4. **Heap máximo** — `src/Structures/Heap.js`: lista de productos más consultados en este navegador.
5. **Grafo** — `src/Structures/Grafo.js`: relaciones entre productos usados como recomendaciones.

## Imágenes originales de Figma y aportes del equipo

Se han incorporado las fotografías compartidas, manteniendo la proporción original (`object-fit: contain`). La web carga estos recursos en `public/images`.

- **Inicio:** personaje DEC `electricista-dec.png`.
- **Categorías:** `categoria-cables.png`, `categoria-iluminacion.png`, `categoria-tomacorrientes.png`, `categoria-tuberias.png`. Las dos exportaciones inicialmente vacías fueron reemplazadas por las imágenes correctas enviadas después.
- **Productos:** reflector solar, cinta LED, extractor, panel LED, kit controlador, protector de voltaje, reflector LED 100W y cable **dúplex 2×18 AWG** Centelsa.
- **Breaker recibido:** la imagen parece indicar **20 A**; se agrega una referencia ilustrativa `breaker-20a-referencia.png` con precio pendiente. No se usa para representar falsamente el **breaker 1×50 A** del diseño.

**Aún faltan fotografías que correspondan exactamente a** toma doble 15 A Enerlux, breaker 1×50 A y tubo PVC 1/2 económico. Estos artículos mantienen un indicador de imagen pendiente en vez de mostrar un producto distinto.

**Corrección importante:** la imagen del rollo Centelsa corresponde al **cable dúplex 2×18 AWG**, no al cable N.º 12. El listado de ejemplo se actualizó sin inventar precios.

Consulta `public/images/LEEME.md` para revisar cada archivo.

## Estado del proyecto / lo que NO está conectado todavía

Esta es una **base navegable y de demostración** que respeta los siete diseños. La cotización se guarda mediante `localStorage` (solo en este navegador) y puede imprimirse desde la vista de cotización con la opción **Guardar como PDF** del navegador. **No envía mensajes ni correos reales**, no verifica inventario y no confirma órdenes. El panel administrativo está limitado por un rol verificado del usuario, pero sus cotizaciones siguen siendo locales. No presentarlo como un sistema productivo.

La importación del catálogo Siigo contiene 2.612 productos y 2.608 marcados activos; el inventario exportado no es una cantidad fiable y múltiples precios figuran «revisar antes de publicar». Por eso solo se usan ocho productos ilustrativos y algunos precios tal como aparecen en el Figma; los restantes muestran «Precio por confirmar». **Los precios ya incluyen IVA; no sumar IVA otra vez.** Es indispensable validar comercialmente todo el catálogo antes de publicarlo.

### Próxima integración de Supabase

1. Crea el proyecto Supabase y configura tablas y políticas RLS de productos, clientes, cotizaciones, líneas y chat.
2. Copia `.env.example` a `.env.local` y coloca `VITE_SUPABASE_URL` y la **clave pública anon**. Nunca uses una clave `service_role` en frontend.
3. La autenticación del formulario usa Supabase Auth cuando el cliente está configurado. `src/Services/supabase.js` devuelve `null` si faltan las variables, así que la web no se rompe.
4. Migra el catálogo validado y los registros de cotizaciones a PostgreSQL. En backend deben aplicarse permisos y descuentos por cantidad verificados; no confiar en totales enviados por el navegador.
5. Configura correo para notificar a DEC con una Edge Function segura. Implementa chat con Supabase Realtime y RLS. Sin estas integraciones, no está completa la rúbrica funcional.
6. Crear branches por integrante y fusionar en `main`, conectar Netlify y publicar documentación técnica y capturas Figma.

## Notas

- Diseño de referencia: pantallas 1440 px; colores `#168B34`, `#173624`, `#F28C28`, `#FFF4E6`, `#F4F7F5`.
- Catálogo demo en `src/data/productos.js`; nunca representar el stock Siigo como disponibilidad garantizada.
- Los datos locales no están asociados a cuentas. La vista `/cotizaciones` requiere login real solo como estructura de navegación; debe migrarse a una tabla filtrada por `auth.uid()` antes de publicar.

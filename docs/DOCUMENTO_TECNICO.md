
# DOCUMENTO TÉCNICO
## Sistema web de Distribuidor Eléctrico de Cali S.A.S.

**Asignatura:** Estructura de Datos y Algoritmos

**Institución:** Universidad Autónoma de Occidente

**Proyecto:** Distribuidor Eléctrico de Cali S.A.S. (DEC)

**Fecha:** Noviembre de 2026

---

## 1. Introducción

Distribuidor Eléctrico de Cali S.A.S. es un establecimiento comercial dedicado a la venta de materiales eléctricos, iluminación y productos relacionados con instalaciones eléctricas.

El proyecto consiste en una plataforma web que facilita la consulta de productos, la organización de solicitudes de cotización y la comunicación entre clientes y administradores.

El sistema integra estructuras de datos para resolver funcionalidades específicas, como deshacer cambios del carrito, organizar solicitudes, buscar productos, identificar artículos consultados y recomendar productos relacionados.

Además, se utiliza Supabase para gestionar la autenticación, el almacenamiento de datos y la comunicación en tiempo real.

---

## 2. Objetivos

### 2.1. Objetivo general

Desarrollar una plataforma web para Distribuidor Eléctrico de Cali S.A.S. que permita gestionar productos, solicitudes de cotización y comunicación con clientes mediante tecnologías web modernas y la aplicación de estructuras de datos.

### 2.2. Objetivos específicos

- Implementar una interfaz web adaptable a diferentes dispositivos.
- Incorporar un catálogo con búsqueda y filtros.
- Permitir la administración del carrito de compras.
- Gestionar solicitudes de cotización.
- Implementar cinco estructuras de datos.
- Incorporar autenticación y roles de usuario.
- Almacenar información comercial en PostgreSQL.
- Habilitar comunicación en tiempo real.
- Realizar pruebas unitarias de las estructuras.
- Publicar el frontend mediante Netlify.

---

## 3. Alcance del sistema

El sistema contempla tres áreas principales.

### 3.1. Módulo público

Permite consultar el catálogo, conocer información de los productos, revisar las condiciones comerciales y consultar la ubicación del almacén.

### 3.2. Módulo de clientes

Permite registrar usuarios, iniciar sesión, administrar el carrito, solicitar cotizaciones, revisar el historial y comunicarse con DEC.

También contempla la respuesta del cliente frente a las propuestas comerciales revisadas.

### 3.3. Módulo administrativo

Permite consultar cotizaciones, revisar precios y cantidades, modificar descuentos, registrar observaciones y gestionar productos.

Los administradores pueden responder mensajes del chat y preparar documentos de cotización.

El envío desde Outlook se realiza actualmente mediante un procedimiento asistido.

### 3.4. Límites del alcance

La plataforma gestiona solicitudes y cotizaciones, pero no constituye por sí misma un sistema de pago en línea.

La creación de una cotización tampoco garantiza la existencia inmediata de inventario.

La disponibilidad debe ser confirmada por DEC.

El sistema no incluye un servicio propio de domicilios.

---

## 4. Arquitectura tecnológica

### 4.1. Frontend

El frontend se desarrolla con React y JavaScript.

Vite se utiliza como entorno de desarrollo y herramienta de compilación.

React Router permite gestionar rutas públicas, privadas y administrativas.

### 4.2. Backend y persistencia

Supabase proporciona servicios de autenticación, base de datos PostgreSQL, almacenamiento y funcionalidades en tiempo real.

Las operaciones comerciales que requieren validaciones especiales pueden ejecutarse mediante funciones RPC de PostgreSQL.

### 4.3. Comunicación en tiempo real

El chat utiliza Supabase Realtime para escuchar la incorporación de mensajes a PostgreSQL.

Los mensajes también quedan almacenados, por lo que pueden consultarse posteriormente.

### 4.4. Publicación

Netlify se utiliza para publicar el frontend.

Las variables de entorno públicas permiten conectar el proyecto publicado con Supabase.

---

## 5. Organización del código

El proyecto organiza los archivos según su responsabilidad:

- `Components`: componentes reutilizables de la interfaz.
- `Context`: estados compartidos y proveedores de React.
- `Helpers`: funciones auxiliares del catálogo.
- `Hooks`: hooks personalizados para consumir los contextos.
- `Pages`: páginas principales.
- `Services`: configuración de Supabase.
- `Structures`: implementaciones de estructuras de datos.
- `data`: información base y utilidades del catálogo.

Esta distribución facilita separar la interfaz de la lógica de negocio y reutilizar funcionalidades.

---

## 6. Estructuras de datos implementadas

Se implementan cinco estructuras organizadas en las categorías solicitadas por la asignatura:

- Dos estructuras lineales: pila y cola.
- Dos estructuras jerárquicas: Trie y Heap máximo.
- Un grafo.

### 6.1. Pila — Stack

**Ubicación:** `src/Structures/Pila.js`

**Principio:** LIFO (Last In, First Out).

La pila se utiliza para almacenar estados anteriores del carrito.

Antes de modificar un artículo, el sistema guarda una copia del contenido actual del carrito.

Cuando el usuario selecciona la opción de deshacer, se recupera el último estado guardado.

**Operaciones principales:**

- `apilar()`: almacena un estado.
- `desapilar()`: recupera el último estado.
- `vacia`: determina si existen elementos.
- `limpiar()`: elimina los estados almacenados.

**Justificación:**

El comportamiento LIFO resulta adecuado porque la acción que debe deshacerse primero es la última modificación realizada.

**Complejidad:**

Las operaciones básicas de inserción y extracción en un arreglo son O(1) amortizado.

La implementación guarda copias de los valores, por lo que el costo total también depende del tamaño del carrito.

Cuando se alcanza el límite de estados, eliminar el registro más antiguo puede requerir O(n).

---

### 6.2. Cola — Queue

**Ubicación:** `src/Structures/Cola.js`

**Principio:** FIFO (First In, First Out).

La cola se utiliza para representar el orden de llegada de solicitudes de cotización en la implementación local.

**Operaciones principales:**

- `encolar()`: agrega una solicitud al final.
- `desencolar()`: retira la primera solicitud.
- `primero()`: consulta la siguiente solicitud.
- `listar()`: obtiene los elementos existentes.

**Justificación:**

La cola permite modelar procesos donde las solicitudes deben atenderse según su orden de llegada.

**Complejidad:**

La inserción mediante `push()` tiene costo amortizado O(1).

La eliminación mediante `shift()` tiene costo O(n) en arreglos de JavaScript, debido al posible desplazamiento de elementos.

**Consideración:**

La estructura Cola se utiliza en el flujo local del proyecto. Las cotizaciones reales se almacenan en PostgreSQL y su orden de consulta se determina mediante la fecha de creación.

---

### 6.3. Trie — Árbol de prefijos

**Ubicación:** `src/Structures/Trie.js`

El Trie organiza palabras mediante nodos conectados por caracteres.

Cada nodo conserva referencias a los identificadores de los productos correspondientes.

Cuando el usuario introduce una palabra o prefijo, el sistema recorre los caracteres para localizar productos coincidentes.

**Operaciones principales:**

- `insertar()`: agrega palabras y referencias de productos.
- `buscarPrefijo()`: localiza productos asociados a un prefijo.

**Aplicación en DEC:**

Se utiliza en la búsqueda del catálogo a través de las funciones de `src/Helpers/busqueda.js`.

**Justificación:**

El Trie resulta apropiado cuando los usuarios buscan productos escribiendo las primeras letras de sus nombres, marcas o categorías.

**Complejidad:**

La inserción de una palabra de longitud m requiere O(m).

La búsqueda de un prefijo de longitud k requiere O(k) para llegar al nodo correspondiente, sin contar la recuperación de los resultados asociados.

La implementación actual construye el índice a partir de los productos proporcionados a la función de búsqueda.

---

### 6.4. Heap máximo

**Ubicación:** `src/Structures/Heap.js`

El Heap máximo organiza elementos según una prioridad.

El elemento con mayor puntaje se encuentra en la raíz.

**Operaciones principales:**

- `insertar()`: incorpora un producto con una prioridad.
- `extraer()`: devuelve el producto de mayor prioridad.

**Aplicación en DEC:**

Permite ordenar productos según las consultas registradas en el navegador.

**Justificación:**

El Heap máximo es apropiado cuando se necesita obtener repetidamente el elemento con mayor prioridad.

**Complejidad:**

La inserción requiere O(log n) en el peor caso.

La extracción del máximo requiere O(log n).

Consultar el elemento máximo almacenado en la raíz es O(1), aunque la implementación disponible expone principalmente su extracción.

**Consideración:**

Los conteos actuales de visitas corresponden al navegador donde se registran, no a una estadística global de todos los clientes.

---

### 6.5. Grafo

**Ubicación:** `src/Structures/Grafo.js`

El grafo representa productos como vértices y sus relaciones como aristas.

La implementación utiliza una lista de adyacencia basada en estructuras `Map` y `Set`.

**Operaciones principales:**

- `vertice()`: incorpora un producto.
- `conectar()`: establece una relación entre dos productos.
- `relacionados()`: obtiene productos relacionados mediante un recorrido.

**Aplicación en DEC:**

Se utiliza en la página de detalle para mostrar recomendaciones de productos relacionados.

**Justificación:**

Los productos eléctricos pueden guardar relaciones por categoría, marca o complementariedad.

El grafo permite representar esas conexiones sin limitar cada producto a una única relación.

**Complejidad:**

Un recorrido completo de búsqueda en anchura tiene complejidad O(V + E), donde V es la cantidad de vértices y E la cantidad de aristas.

La implementación limita la cantidad de resultados devueltos según la necesidad de la interfaz.

---

## 7. Relación entre estructuras y funcionalidades

| Estructura | Funcionalidad | Beneficio |
|---|---|---|
| Pila | Deshacer cambios del carrito | Recuperar estados anteriores |
| Cola | Solicitudes locales de cotización | Organizar por orden de llegada |
| Trie | Buscador de productos | Encontrar coincidencias por prefijo |
| Heap máximo | Productos más consultados | Priorizar elementos |
| Grafo | Productos relacionados | Generar recomendaciones |

Las estructuras no se utilizaron solamente como ejercicios independientes: se relacionaron con necesidades concretas de la plataforma.

---

## 8. Gestión de datos

### 8.1. Autenticación

Supabase Auth permite el registro y el inicio de sesión.

La aplicación diferencia entre usuarios clientes y administradores.

### 8.2. Cotizaciones

Las solicitudes se almacenan en la tabla `quotes`.

Los productos asociados se almacenan en `quote_items`.

La separación permite relacionar una cotización con varios productos y conservar sus cantidades y valores.

### 8.3. Revisión comercial

El administrador puede ajustar los precios y descuentos de una cotización sin modificar necesariamente el precio general del catálogo.

La revisión puede conservar información del valor original para facilitar la comparación.

### 8.4. Chat

Los mensajes se almacenan en `dec_chat_messages`.

Cada mensaje identifica:

- El cliente propietario de la conversación.
- El usuario que envía el mensaje.
- El contenido.
- La fecha de creación.

### 8.5. Control de acceso

Se utilizan políticas RLS para limitar el acceso a información privada.

Los clientes deben consultar únicamente sus propios registros y conversaciones.

Las operaciones administrativas requieren permisos específicos.

---

## 9. Proceso de cotización

El flujo comercial se desarrolla de la siguiente manera:

1. El cliente consulta los productos.
2. Agrega artículos al carrito.
3. Ajusta las cantidades.
4. Solicita una cotización.
5. La solicitud se guarda en la base de datos.
6. El administrador consulta la solicitud.
7. Revisa los productos y precios.
8. Aplica descuentos u observaciones.
9. Guarda la revisión.
10. Prepara el PDF.
11. Envía el documento utilizando el correo oficial.
12. Registra el envío en la aplicación.
13. El cliente consulta la propuesta.
14. El cliente puede aceptar o rechazar la cotización enviada.
15. DEC continúa con la confirmación comercial que corresponda.

La aceptación de la propuesta no sustituye la verificación final de inventario y condiciones comerciales.

---

## 10. Pruebas realizadas

Las estructuras se validaron mediante Vitest.

El archivo de pruebas es:

`src/Structures/estructuras.test.js`

### Resultados

| Estructura | Pruebas | Resultado |
|---|---:|---|
| Pila | 2 | Aprobadas |
| Cola | 2 | Aprobadas |
| Trie | 3 | Aprobadas |
| Heap máximo | 2 | Aprobadas |
| Grafo | 2 | Aprobadas |
| **Total** | **11** | **11 aprobadas** |

La ejecución reportó:

- 1 archivo de pruebas aprobado.
- 11 pruebas exitosas.
- 0 pruebas fallidas.
- Duración aproximada: 270 ms.

### Interpretación

Los resultados permiten comprobar las operaciones implementadas en las cinco estructuras para los casos evaluados.

No significan que todas las funciones de la aplicación estén libres de errores.

Es necesario complementar estas pruebas con verificaciones de interfaz, autenticación, base de datos y comunicación en tiempo real.

---

## 11. Interfaz y experiencia de usuario

La identidad visual utiliza principalmente verde, naranja y blanco.

La interfaz incorpora:

- Navegación entre páginas.
- Tarjetas de productos.
- Diseño adaptable.
- Carrito.
- Panel administrativo.
- Historial de cotizaciones.
- Chat flotante.
- Información sobre recogida de pedidos.
- Enlace de ubicación a Google Maps.

La propuesta gráfica se encuentra en Figma.

---

## 12. Ubicación y condiciones comerciales

Distribuidor Eléctrico de Cali S.A.S. se encuentra en:

Carrera 6 #18-91, barrio San Nicolás, Cali, Valle del Cauca, Colombia.

Google Maps:
https://maps.app.goo.gl/Qfhj4Rs5PPV6i9dk7

El almacén no realiza domicilios.

Los pedidos se recogen en el punto físico o se entregan allí a un repartidor contratado por el cliente.

Los precios y la disponibilidad están sujetos a confirmación comercial.

---

## 13. Limitaciones y mejoras futuras

Se identifican oportunidades de evolución del sistema:

- Automatizar completamente los correos con PDF adjunto.
- Integrar estadísticas globales de productos consultados.
- Sincronizar de forma más directa la cola de atención con las solicitudes persistentes.
- Agregar notificaciones para mensajes nuevos.
- Ampliar las pruebas de integración y seguridad.
- Incorporar una gestión de inventario más detallada.
- Mejorar el seguimiento del estado de cada solicitud.

Estas funcionalidades pueden implementarse sin modificar el objetivo principal de la plataforma.

---

## 14. Conclusiones

El desarrollo permitió aplicar conceptos de Estructura de Datos y Algoritmos en un sistema orientado a un problema comercial real.

La pila, la cola, el Trie, el Heap máximo y el grafo resuelven necesidades diferentes dentro de la aplicación.

La integración de React y Supabase permite construir una interfaz interactiva con autenticación, persistencia y comunicación en tiempo real.

Las once pruebas unitarias aprobadas proporcionan evidencia del comportamiento de las estructuras evaluadas.

El proyecto constituye una base funcional para facilitar el contacto con clientes y la gestión de solicitudes de cotización de Distribuidor Eléctrico de Cali S.A.S.

---

## 15. Enlaces

**Repositorio:**
https://github.com/DannaVillegas2/Homeworks

**Rama DEC:**
https://github.com/DannaVillegas2/Homeworks/tree/ProyectoFinal-DEC

**Diseño Figma:**
https://www.figma.com/design/odwDga47WDg8drgeqKDKBS/DEC-S.A.S.-%E2%80%94-Proyecto-Final-Estructura-de-Datos?node-id=0-1

**Sitio web Netlify:**
https://distribuidor-electrico-dec.netlify.app

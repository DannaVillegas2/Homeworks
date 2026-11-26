
# Distribuidor Eléctrico de Cali S.A.S. — DEC

## Proyecto Final de Estructura de Datos y Algoritmos

Plataforma web desarrollada para Distribuidor Eléctrico de Cali S.A.S., un establecimiento comercial dedicado a la venta de materiales eléctricos, productos de iluminación y accesorios para instalaciones eléctricas en Cali, Colombia.

El proyecto permite consultar productos, gestionar un carrito, solicitar cotizaciones, consultar su historial y comunicarse con el almacén mediante un chat.

También cuenta con funcionalidades administrativas para la gestión del catálogo y la revisión comercial de las solicitudes.

---

## Enlaces del proyecto

- **Repositorio de GitHub:** https://github.com/DannaVillegas2/Homeworks
- **Rama de desarrollo DEC:** https://github.com/DannaVillegas2/Homeworks/tree/ProyectoFinal-DEC
- **Página web en Netlify:** https://distribuidor-electrico-dec.netlify.app
- **Diseño en Figma:** https://www.figma.com/design/odwDga47WDg8drgeqKDKBS/DEC-S.A.S.-%E2%80%94-Proyecto-Final-Estructura-de-Datos?node-id=0-1

La versión desplegada debe actualizarse con los cambios más recientes del proyecto antes de la entrega final.

---


## Integrante del proyecto

Danna Valentina Villegas Vargas - 2240027

Universidad Autónoma de Occidente  
Asignatura: Estructura de Datos y Algoritmos

El proyecto fue desarrollado de manera individual.

La rama `ProyectoFinal-DEC` contiene el desarrollo de la aplicación, sus funcionalidades, las estructuras de datos, las pruebas y la documentación técnica.


---

## Objetivo general

Desarrollar una plataforma web para Distribuidor Eléctrico de Cali S.A.S. que facilite la consulta de materiales eléctricos, la gestión de solicitudes de cotización y la comunicación entre clientes y administradores, mediante el uso de React, Supabase y estructuras de datos.

---

## Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| React | Construcción de la interfaz |
| JavaScript | Lógica de negocio y estructuras de datos |
| Vite | Entorno de desarrollo y compilación |
| React Router | Navegación pública y privada |
| Supabase Auth | Registro e inicio de sesión |
| PostgreSQL | Almacenamiento de información |
| Supabase Realtime | Actualización de mensajes del chat |
| Supabase Storage | Almacenamiento de imágenes |
| Supabase RPC | Operaciones de cotizaciones |
| jsPDF | Generación de documentos PDF |
| Vitest | Pruebas de estructuras de datos |
| Netlify | Publicación del frontend |
| Git y GitHub | Control de versiones |

---

## Funcionalidades del sistema

### Funcionalidades públicas

- Página de inicio.
- Catálogo de productos eléctricos.
- Filtros y búsqueda de productos.
- Detalles y recomendaciones de productos relacionados.
- Consulta de precios cuando están disponibles.
- Visualización del carrito de compras.
- Información del almacén y sus condiciones de entrega.
- Enlace a Google Maps.

### Funcionalidades de clientes

- Registro de cuenta.
- Inicio y cierre de sesión.
- Administración del carrito.
- Modificación de cantidades.
- Deshacer cambios del carrito.
- Solicitud de cotizaciones.
- Consulta del historial de cotizaciones.
- Visualización de cotizaciones revisadas.
- Generación o visualización del documento de cotización.
- Chat con el almacén.
- Respuesta de aceptación o rechazo de una propuesta enviada.

### Funcionalidades administrativas

- Acceso restringido según el rol.
- Consulta de solicitudes recibidas.
- Revisión de productos y cantidades.
- Modificación de precios de una cotización.
- Aplicación de descuentos comerciales.
- Registro de observaciones.
- Gestión del catálogo de productos.
- Consulta y respuesta de conversaciones del chat.
- Preparación de cotizaciones para envío por correo.
- Registro manual de cotizaciones enviadas.

---

## Estructuras de datos implementadas

Se implementaron cinco estructuras de datos, distribuidas según los requisitos de la asignatura.

### 1. Pila (Stack)

**Archivo:** `src/Structures/Pila.js`

Permite guardar versiones anteriores del carrito de compras.

Se utiliza para deshacer la última modificación realizada por el usuario, siguiendo el principio LIFO: Last In, First Out.

### 2. Cola (Queue)

**Archivo:** `src/Structures/Cola.js`

Organiza solicitudes de cotización mediante el principio FIFO: First In, First Out.

La implementación de la cola se utiliza en el flujo local de demostración. Las cotizaciones reales se almacenan y gestionan mediante PostgreSQL.

### 3. Trie

**Archivo:** `src/Structures/Trie.js`

Permite indexar palabras y buscar productos por prefijos.

Se integra con las funciones del catálogo mediante `src/Helpers/busqueda.js`.

### 4. Heap máximo

**Archivo:** `src/Structures/Heap.js`

Permite priorizar productos según su cantidad de consultas registradas.

Se utiliza para obtener un listado de productos más consultados en el navegador.

### 5. Grafo

**Archivo:** `src/Structures/Grafo.js`

Representa relaciones entre productos mediante vértices y conexiones.

Se utiliza para recomendar productos relacionados en la página de detalle.

---

## Organización del proyecto

```text
ProyectoFinalDEC/
|
|-- public/
|   |-- images/
|
|-- src/
|   |-- Components/
|   |   |-- ChatDEC.jsx
|   |   |-- AvisoEntregas.jsx
|   |   |-- AvisoEntregas.css
|   |   |-- Header.jsx
|   |   |-- Footer.jsx
|   |   |-- Layout.jsx
|   |
|   |-- Context/
|   |   |-- AuthContext.jsx
|   |   |-- TiendaContext.jsx
|   |
|   |-- Helpers/
|   |   |-- busqueda.js
|   |
|   |-- Hooks/
|   |
|   |-- Pages/
|   |   |-- Inicio.jsx
|   |   |-- Productos.jsx
|   |   |-- DetalleProducto.jsx
|   |   |-- Carrito.jsx
|   |   |-- Cotizaciones.jsx
|   |   |-- CotizacionImprimir.jsx
|   |   |-- PanelAdmin.jsx
|   |   |-- GestionProductos.jsx
|   |
|   |-- Services/
|   |   |-- supabase.js
|   |
|   |-- Structures/
|   |   |-- Pila.js
|   |   |-- Cola.js
|   |   |-- Trie.js
|   |   |-- Heap.js
|   |   |-- Grafo.js
|   |   |-- estructuras.test.js
|   |
|   |-- data/
|   |
|   |-- App.jsx
|   |-- main.jsx
|
|-- docs/
|   |-- DOCUMENTO_TECNICO.md
|
|-- package.json
|-- README.md
```

---

## Configuración local

### Requisitos

- Node.js.
- npm.
- Proyecto de Supabase configurado.
- Variables de entorno del frontend.

### Instalación

Clonar el repositorio y acceder a la carpeta del proyecto.

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env.local` con las variables públicas de Supabase:

```env
VITE_SUPABASE_URL=URL_DEL_PROYECTO
VITE_SUPABASE_ANON_KEY=CLAVE_PUBLICA
```

No se deben publicar claves privadas, contraseñas ni credenciales administrativas.

Iniciar el proyecto:

```bash
npm run dev
```

Compilar para producción:

```bash
npm run build
```

---

## Pruebas de estructuras de datos

Se utiliza Vitest para comprobar las operaciones fundamentales de las cinco estructuras.

Ejecutar:

```bash
npx vitest run src/Structures/estructuras.test.js
```

### Resultado de las pruebas realizadas

| Estructura | Pruebas aprobadas |
|---|---:|
| Pila | 2 |
| Cola | 2 |
| Trie | 3 |
| Heap máximo | 2 |
| Grafo | 2 |
| **Total** | **11/11** |

Las pruebas comprueban el orden de inserción y extracción, las búsquedas por prefijos, la priorización de productos y la relación entre vértices.

Estos resultados corresponden a las pruebas unitarias de estructuras de datos, no a una certificación completa de todas las funcionalidades del sistema.

---

## Seguridad

El sistema utiliza Supabase Authentication para gestionar sesiones.

Las operaciones administrativas se restringen según los permisos del usuario.

Se utilizan políticas Row Level Security (RLS) para controlar el acceso a los datos de los clientes y a las conversaciones del chat.

Las operaciones que requieren validaciones de negocio pueden ejecutarse mediante funciones PostgreSQL.

No deben almacenarse credenciales privadas de Supabase ni claves de servicios de correo en el código del frontend.

---

## Cotizaciones y correo electrónico

El sistema permite crear y revisar cotizaciones.

Las propuestas comerciales pueden incluir modificaciones de precios, descuentos y observaciones.

Actualmente el envío desde la cuenta oficial de Outlook/Hotmail utiliza un proceso asistido:

1. El administrador revisa la cotización.
2. Genera el PDF actualizado.
3. Prepara el mensaje dirigido al cliente.
4. Adjunta el archivo en Outlook.
5. Envía el correo desde la cuenta oficial.
6. Registra manualmente el envío en DEC.

La función de envío automático con archivos adjuntos queda como mejora futura para la operación comercial.

---

## Condiciones comerciales

Distribuidor Eléctrico de Cali S.A.S. no realiza domicilios.

Los pedidos se recogen en el punto físico o pueden ser entregados allí a un repartidor contratado por el cliente.

La disponibilidad y las condiciones comerciales deben ser confirmadas por el almacén.

Los precios publicados que han sido confirmados incluyen IVA.

---

## Ubicación y contacto

**Distribuidor Eléctrico de Cali S.A.S.**

Carrera 6 #18-91, barrio San Nicolás, Cali, Valle del Cauca, Colombia.

**Google Maps:**
https://maps.app.goo.gl/Qfhj4Rs5PPV6i9dk7

**Correo electrónico:**
distribuidorelectricodecali@hotmail.com

**WhatsApp:**
315 373 5319

---

## Publicación

El frontend se publica mediante Netlify y utiliza Supabase como servicio externo de autenticación, base de datos, almacenamiento y tiempo real.

Los cambios locales deben compilarse y desplegarse nuevamente para quedar disponibles en la versión pública.

---

## Documentación técnica

La descripción del alcance, la arquitectura, las estructuras de datos y sus justificaciones se encuentra en:

`docs/DOCUMENTO_TECNICO.md`

---

## Estado de la entrega

Antes de entregar deben comprobarse:

- Integración de los cambios finales en GitHub.
- Aportes de cada integrante en su rama correspondiente.
- Fusión de las ramas requeridas sobre `main`.
- Variables de entorno configuradas en Netlify.
- Publicación de la versión actualizada.
- Funcionamiento de rutas públicas y privadas.
- Funcionamiento del chat con cuentas reales.
- Validación de la creación y revisión de cotizaciones.
- Inclusión del documento técnico en GitHub.
- Nombres completos de los integrantes en este README.

---

Proyecto académico desarrollado para la asignatura Estructura de Datos y Algoritmos de la Universidad Autónoma de Occidente.

// CATÁLOGO DE DEMOSTRACIÓN: primeros cuatro importes representados en el Figma.
// Corrección del equipo: el rollo suministrado corresponde a cable dúplex 2×18 AWG, NO al cable N.12.
// El breaker recibido parece indicar 20 A, no 50 A; se mantiene la referencia 50 A sin foto.
// Los precios NO sustituyen la validación comercial de DEC.
// `precio: null` = precio pendiente de confirmar, nunca se muestra como $0.
export const productosDemo = [
  { id: 'reflector-solar-300w', nombre: 'REFLECTOR SOLAR 300W CCT', categoria: 'Iluminación', marca: 'Mercury', precio: 198000, imagen: '/images/reflector-solar-300w.png', destacado: true, descripcion: 'Reflector solar del catálogo de iluminación. Confirma características y disponibilidad con nuestro equipo.' },
  { id: 'cinta-led-neonflex', nombre: 'CINTA LED NEONFLEX 5W RGB', categoria: 'Iluminación', marca: '', precio: 38000, imagen: '/images/cinta-led-neonflex.png', destacado: true, descripcion: 'Cinta LED decorativa de la sección de iluminación.' },
  { id: 'extractor-industrial-16', nombre: 'EXTRACTOR INDUSTRIAL 16” ASPA METÁLICA', categoria: 'Extractores', marca: 'Cheka', precio: 408000, imagen: '/images/extractor-industrial-16.png', destacado: true, descripcion: 'Extractor industrial de aspas metálicas. Confirma las especificaciones antes de solicitar.' },
  { id: 'panel-sobreponer-18w', nombre: 'PANEL SOBREPONER 18W 6500K', categoria: 'Iluminación', marca: '', precio: 10000, imagen: '/images/panel-sobreponer-18w.png', destacado: true, descripcion: 'Panel LED de sobreponer para proyectos de iluminación.' },
  { id: 'cable-duplex-2x18', nombre: 'CABLE DÚPLEX 2×18 AWG CENTELSA', categoria: 'Cables y conductores', marca: 'Centelsa', precio: null, imagen: '/images/cable-duplex-2x18.png', destacado: false, descripcion: 'Cable dúplex Centelsa, dos conductores calibre 18 AWG. Precio, presentación y disponibilidad por confirmar.' },
  { id: 'toma-doble-15a', nombre: 'TOMA DOBLE 15 AMP NARANJA ENERLUX', categoria: 'Interruptores y tomacorrientes', marca: 'Enerlux', precio: 6800, imagen: '/images/toma doble naranja.jpg', destacado: false, descripcion: 'Tomacorriente doble. Precio y disponibilidad por confirmar.' },
  { id: 'breaker-1x20a', nombre: 'BREAKER ENCHUFABLE 1X20 AMP', categoria: 'Protecciones eléctricas', marca: '', precio: 21000, imagen: '/images/breaker-20a-referencia.png', destacado: false, descripcion: 'Breaker enchufable. Precio y disponibilidad por confirmar.' },
  { id: 'tubo-pvc-media', nombre: 'TUBO PVC 1/2 PAVCO', categoria: 'Tuberías y canalizaciones', marca: 'null', precio: 4600, imagen: '/images/tubo pvc media.jpg', destacado: false, descripcion: 'Tubo PVC para canalización. Precio y disponibilidad por confirmar.' },
  { id: 'kit-controlador-cinta-led', nombre: 'KIT CONTROLADOR PARA CINTA LED RGB', categoria: 'Iluminación', marca: 'Mercury', precio: 19000, imagen: '/images/kit-controlador-cinta-led.png', destacado: false, descripcion: 'Kit controlador de cinta LED RGB, ilustrado en el material suministrado. Características por confirmar.' },
  { id: 'protector-voltaje-120vac', nombre: 'PROTECTOR DE VOLTAJE 120 VAC', categoria: 'Protecciones eléctricas', marca: 'Mercury', precio: 28000, imagen: '/images/protector-voltaje-120vac.png', destacado: false, descripcion: 'Protector de voltaje. Confirma capacidad y disponibilidad con DEC.' },
  { id: 'reflector-led-100w', nombre: 'REFLECTOR LED 100W', categoria: 'Iluminación', marca: 'Mercury', precio: 40000, imagen: '/images/reflector-led-100w.png', destacado: false, descripcion: 'Reflector LED de 100 W. Consulta disponibilidad y características.' },
  { id: 'interruptor-doble-uduke', nombre: 'INTERRUPTOR DOBLE UDUKE', categoria: 'Interruptores y tomacorrientes', marca: 'Uduke', precio: 5500, imagen: '/images/interruptor-doble-uduke.png', destacado: false, descripcion: 'Interruptor doble de la marca Uduke. Precio y disponibilidad por confirmar.' },
  { id: 'toma-doble-uduke', nombre: 'TOMA DOBLE UDUKE', categoria: 'Interruptores y tomacorrientes', marca: 'Uduke', precio: 5500, imagen: '/images/toma-doble-uduke.png', destacado: false, descripcion: 'Tomacorriente doble de la marca Uduke. Precio y disponibilidad por confirmar.' },
  { id: 'interruptor+toma-uduke', nombre: 'INTERRUPTOR Y TOMA DOBLE UDUKE', categoria: 'Interruptores y tomacorrientes', marca: 'Uduke', precio: 5500, imagen: '/images/interruptor+toma.png', destacado: false, descripcion: 'Interruptor y tomacorriente doble de la marca Uduke. Precio y disponibilidad por confirmar.' },
  { id: 'interruptor-triple-uduke', nombre: 'INTERRUPTOR TRIPLE UDUKE', categoria: 'Interruptores y tomacorrientes', marca: 'Uduke', precio: 7000, imagen: '/images/interruptor-triple.png', destacado: false, descripcion: 'Interruptor y tomacorriente triple de la marca Uduke. Precio y disponibilidad por confirmar.' },
  { id: 'tubo-emt-3/4', nombre: 'TUBO EMT 3/4"', categoria: 'Tuberías y canalizaciones', marca: 'null', precio: 17500, imagen: '/images/tubo-emt.png', destacado: false, descripcion: 'Tubo EMT 3/4". Precio y disponibilidad por confirmar.' },

];
export const categorias = [
  { nombre: 'Cables y conductores', slug: 'cables', imagen: '/images/categoria-cables.png' },
  { nombre: 'Iluminación', slug: 'iluminacion', imagen: '/images/categoria-iluminacion.png' },
  { nombre: 'Interruptores y tomacorrientes', slug: 'tomacorrientes', imagen: '/images/categoria-tomacorrientes.png' },
  { nombre: 'Tuberías y canalizaciones', slug: 'tuberias', imagen: '/images/tuberia.png' },
];
export const formatoCOP = (precio) => precio == null || !Number.isFinite(Number(precio))
  ? 'Precio por confirmar'
  : new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0}).format(precio);
export const normalizar = (texto='') => String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

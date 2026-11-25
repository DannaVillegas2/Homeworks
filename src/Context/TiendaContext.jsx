
import { useEffect, useRef, useState } from 'react';

import { Pila } from '../Structures/Pila';
import { Cola } from '../Structures/Cola';
import { productosDemo } from '../data/productos';
import { supabase } from '../Services/supabase';
import { TiendaContext } from './tienda-store';

// LEER INFORMACIÓN DEL NAVEGADOR

const leer = (clave, defecto) => {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return valor ?? defecto;
  } catch {
    return defecto;
  }
};

export function TiendaProvider({ children }) {

  // CATÁLOGO COMPARTIDO

  const [productos, setProductos] = useState(productosDemo);

  const [estadoCatalogo, setEstadoCatalogo] =
    useState('cargando');

  // CARRITO, COTIZACIONES Y VISITAS

  const [carrito, setCarrito] = useState(
    () => leer('dec_carrito_demo', [])
  );

  const [cotizaciones, setCotizaciones] = useState(
    () => leer('dec_cotizaciones_demo', [])
  );

  const [visitas, setVisitas] = useState(
    () => leer('dec_visitas_demo', {})
  );

  // Estructura de datos: Pila
  const pila = useRef(new Pila());

  const [puedeDeshacer, setPuedeDeshacer] =
    useState(false);

  // CONSULTAR PRODUCTOS DESDE SUPABASE

  useEffect(() => {
    let activo = true;

    async function cargarCatalogo() {

      if (!supabase) {
        setEstadoCatalogo('sin-conexion');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            category,
            brand,
            description,
            image_url,
            price_cop,
            price_validated
          `)
          .eq('active', true);

        if (error) throw error;

        if (!activo) return;

        // Mantener temporalmente productos locales
        const mapa = new Map(
          productosDemo.map((p) => [p.id, p])
        );

        // Incorporar productos de PostgreSQL
        for (const p of data || []) {

          const local = mapa.get(p.id);

          mapa.set(p.id, {
            ...local,

            id: p.id,
            nombre: p.name,
            categoria: p.category,

            marca:
              p.brand ?? local?.marca ?? '',

            descripcion:
              p.description ||
              local?.descripcion ||
              '',

            imagen:
              p.image_url ||
              local?.imagen ||
              '',

            precio:
              p.price_cop == null
                ? null
                : Number(p.price_cop),

            precioValidado:
              p.price_validated,

            destacado:
              local?.destacado ?? false
          });
        }

        setProductos([...mapa.values()]);
        setEstadoCatalogo('conectado');

        console.log(
          'Catálogo compartido conectado:',
          data?.length ?? 0,
          'productos desde Supabase'
        );

      } catch (error) {

        console.error(
          'Error al cargar productos:',
          error
        );

        if (activo) {
          setEstadoCatalogo('error');
        }
      }
    }

    cargarCatalogo();

    return () => {
      activo = false;
    };
  }, []);

  // PERSISTENCIA LOCAL

  useEffect(() => {
    localStorage.setItem(
      'dec_carrito_demo',
      JSON.stringify(carrito)
    );
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem(
      'dec_cotizaciones_demo',
      JSON.stringify(cotizaciones)
    );
  }, [cotizaciones]);

  useEffect(() => {
    localStorage.setItem(
      'dec_visitas_demo',
      JSON.stringify(visitas)
    );
  }, [visitas]);

  // PILA: GUARDAR CAMBIOS

  const guardarCambio = (actualizar) => {

    pila.current.apilar(carrito);

    setPuedeDeshacer(true);

    setCarrito(actualizar(carrito));
  };

  // AGREGAR PRODUCTOS AL CARRITO

  const agregar = (id, cantidad = 1) => {

    const producto = productos.find(
      (p) => p.id === id
    );

    if (!producto) return;

    const n = Math.max(
      1,
      Math.min(99, Number(cantidad) || 1)
    );

    guardarCambio((actual) => {

      const fila = actual.find(
        (p) => p.id === id
      );

      if (fila) {
        return actual.map((p) =>
          p.id === id
            ? {
                ...p,
                cantidad: Math.min(
                  99,
                  p.cantidad + n
                )
              }
            : p
        );
      }

      return [
        ...actual,
        { id, cantidad: n }
      ];
    });
  };

  // CAMBIAR CANTIDAD

  const cambiarCantidad = (id, cantidad) => {

    guardarCambio((actual) =>
      actual.map((p) =>
        p.id === id
          ? {
              ...p,
              cantidad: Math.max(
                1,
                Math.min(
                  99,
                  Number(cantidad) || 1
                )
              )
            }
          : p
      )
    );
  };

  // ELIMINAR PRODUCTO

  const quitar = (id) => {

    guardarCambio((actual) =>
      actual.filter((p) => p.id !== id)
    );
  };

  // PILA: DESHACER ÚLTIMO CAMBIO

  const deshacer = () => {

    const anterior = pila.current.desapilar();

    if (anterior !== null) {
      setCarrito(anterior);
    }

    setPuedeDeshacer(!pila.current.vacia);
  };

  // CREAR COTIZACIÓN REAL EN SUPABASE

  const crearCotizacion = async () => {

    // Verificar que el carrito tenga productos
    if (!carrito.length) {
      throw new Error(
        'El carrito está vacío.'
      );
    }

    // Verificar conexión con Supabase
    if (!supabase) {
      throw new Error(
        'Supabase no está configurado.'
      );
    }

    // Verificar usuario autenticado
    const {
      data: { user },
      error: errorSesion
    } = await supabase.auth.getUser();

    if (errorSesion || !user) {
      throw new Error(
        'Debes iniciar sesión para solicitar una cotización.'
      );
    }

    // Preparar productos del carrito
    // Solo enviamos ID y cantidad.
    // PostgreSQL calcula los precios.
    const items = carrito.map(
      ({ id, cantidad }) => ({
        id,
        cantidad: Number(cantidad)
      })
    );

    // Ejecutar función segura en PostgreSQL
    const {
      data: idCotizacion,
      error
    } = await supabase.rpc(
      'crear_cotizacion_dec',
      {
        p_items: items,
        p_nota: null
      }
    );

    if (error) {
      console.error(
        'Error al crear cotización:',
        error
      );

      throw new Error(
        error.message ||
        'No se pudo guardar la cotización.'
      );
    }

    if (!idCotizacion) {
      throw new Error(
        'No se recibió el identificador de la cotización.'
      );
    }

    console.log(
      'Cotización guardada en PostgreSQL:',
      idCotizacion
    );

    // COPIA LOCAL PARA EL PDF

    const nueva = {

      id: idCotizacion,

      fecha: new Date().toISOString(),

      estado: 'Pendiente',

      items: carrito.map(({ id, cantidad }) => {

        const producto = productos.find(
          (p) => p.id === id
        );

        return {
          id,

          nombre:
            producto?.nombre || id,

          // Utilizamos el precio registrado,
          // aunque todavía esté pendiente
          // de validación comercial.
          precio:
            producto?.precio ?? null,

          cantidad
        };
      }),

      origen: 'supabase'
    };

    // COLA: REGISTRAR COTIZACIÓN

    const cola = new Cola(cotizaciones);

    cola.encolar(nueva);

    setCotizaciones(cola.listar());

    // Guardar carrito anterior en la pila
    pila.current.apilar(carrito);

    setPuedeDeshacer(true);

    // Vaciar carrito después de guardar
    setCarrito([]);

    return nueva;
  };

  // HEAP: REGISTRAR VISITAS

  const registrarVisita = (id) => {

    setVisitas((actual) => ({
      ...actual,
      [id]: (actual[id] || 0) + 1
    }));
  };

  // TOTAL DE PRODUCTOS

  const totalItems = carrito.reduce(
    (total, p) => total + p.cantidad,
    0
  );

  // SUBTOTAL DEL CARRITO

  const subtotal = carrito.reduce(
    (total, fila) => {

      const producto = productos.find(
        (p) => p.id === fila.id
      );

      return total +
        (producto?.precio ?? 0) * fila.cantidad;

    },
    0
  );

  // IDENTIFICAR PRECIOS PENDIENTES

  const tienePreciosPendientes = carrito.some(
    (fila) => {

      const producto = productos.find(
        (p) => p.id === fila.id
      );

      return (
        !producto ||
        producto.precio == null ||
        producto.precioValidado !== true
      );
    }
  );

  // DATOS COMPARTIDOS CON TODA LA APP

  const valores = {

    productos,
    estadoCatalogo,

    carrito,
    cotizaciones,
    visitas,

    agregar,
    cambiarCantidad,
    quitar,
    deshacer,

    puedeDeshacer,
    crearCotizacion,
    registrarVisita,

    totalItems,
    subtotal,
    tienePreciosPendientes
  };

  return (
    <TiendaContext.Provider value={valores}>
      {children}
    </TiendaContext.Provider>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Trash2,
  Undo2,
  ShoppingCart
} from 'lucide-react';

import ImagenProducto from '../Components/ImagenProducto';
import ControlCantidad from '../Components/ControlCantidad';
import { formatoCOP } from '../data/productos';
import { useTienda } from '../Hooks/useTienda';

export default function Carrito() {
  const navegar = useNavigate();

  // ESTADOS DE LA SOLICITUD
  const [enviando, setEnviando] = useState(false);
  const [errorCotizacion, setErrorCotizacion] = useState('');

  // DATOS COMPARTIDOS DE LA TIENDA
  const {
    productos,
    carrito,
    totalItems,
    subtotal,
    tienePreciosPendientes,
    cambiarCantidad,
    quitar,
    deshacer,
    puedeDeshacer,
    crearCotizacion
  } = useTienda();

  // BUSCAR PRODUCTO EN EL CATÁLOGO COMPARTIDO
  const buscarProducto = (id) => {
    return productos.find((p) => p.id === id);
  };

  // CREAR COTIZACIÓN REAL EN SUPABASE

  const solicitarCotizacion = async () => {
    if (!carrito.length || enviando) return;

    setEnviando(true);
    setErrorCotizacion('');

    try {
      // Esperar la respuesta de PostgreSQL
      const cotizacion = await crearCotizacion();

      if (!cotizacion?.id) {
        throw new Error(
          'No se recibió el identificador de la cotización.'
        );
      }

      console.log(
        'Cotización creada correctamente:',
        cotizacion.id
      );

      // Abrir la vista de impresión
      navegar(
        `/cotizacion/${cotizacion.id}/imprimir`
      );

    } catch (error) {
      console.error(
        'Error al solicitar cotización:',
        error
      );

      setErrorCotizacion(
        error?.message ||
        'No se pudo guardar la cotización. Inténtalo nuevamente.'
      );

    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="pagina-contenido carrito-pagina">

      <h1>Mi carrito de compras</h1>

      <div className="carrito-grid">

        {/* PRODUCTOS DEL CARRITO */}

        <div className="carrito-izquierda">

          {carrito.length > 0 ? (
            carrito.map((fila) => {

              const producto = buscarProducto(fila.id);

              // PRODUCTO NO ENCONTRADO
              if (!producto) {
                return (
                  <article
                    key={fila.id}
                    className="carrito-fila"
                  >
                    <div className="carrito-fila-info">
                      <h2>Producto no disponible</h2>

                      <p>
                        Este artículo ya no está
                        disponible en el catálogo.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="eliminar-producto"
                      disabled={enviando}
                      onClick={() => quitar(fila.id)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </article>
                );
              }

              return (
                <article
                  key={fila.id}
                  className="carrito-fila"
                >

                  {/* IMAGEN DEL PRODUCTO */}
                  <Link
                    to={`/productos/${producto.id}`}
                    aria-label={`Ver ${producto.nombre}`}
                  >
                    <ImagenProducto
                      className="carrito-foto"
                      src={producto.imagen}
                      alt={producto.nombre}
                    />
                  </Link>

                  {/* INFORMACIÓN DEL PRODUCTO */}
                  <div className="carrito-fila-info">

                    <Link
                      to={`/productos/${producto.id}`}
                    >
                      <h2>{producto.nombre}</h2>
                    </Link>

                    <strong>
                      {formatoCOP(producto.precio)}
                    </strong>

                    {/* CANTIDAD EDITABLE CON TECLADO */}
                    <ControlCantidad
                      cantidad={fila.cantidad}
                      onCambiar={(nuevaCantidad) => {
                        if (!enviando) {
                          cambiarCantidad(
                            fila.id,
                            nuevaCantidad
                          );
                        }
                      }}
                    />

                  </div>

                  {/* ELIMINAR PRODUCTO */}
                  <button
                    type="button"
                    className="eliminar-producto"
                    disabled={enviando}
                    aria-label={`Eliminar ${producto.nombre}`}
                    onClick={() => quitar(producto.id)}
                  >
                    <Trash2 size={20} />
                  </button>

                </article>
              );
            })
          ) : (

            /* CARRITO VACÍO */
            <div className="estado-vacio carrito-vacio">

              <ShoppingCart size={46} />

              <h2>Tu carrito está vacío</h2>

              <p>
                Explora nuestro catálogo y agrega
                los productos que necesites.
              </p>

              <Link
                className="boton-verde"
                to="/productos"
              >
                Ver productos
              </Link>

            </div>
          )}

          {/* PILA: DESHACER CAMBIOS */}

          {puedeDeshacer && (
            <button
              type="button"
              className="boton-enlace deshacer"
              disabled={enviando}
              onClick={deshacer}
            >
              <Undo2 size={16} />
              Deshacer último cambio
            </button>
          )}

        </div>

        {/* RESUMEN DE COTIZACIÓN */}

        <aside className="resumen-cotizacion">

          <h2>Resumen de cotización</h2>

          {/* SUBTOTAL */}
          <div className="resumen-linea">
            <span>
              Subtotal ({totalItems}{' '}
              {totalItems === 1
                ? 'producto'
                : 'productos'})
            </span>

            <b>
              {formatoCOP(subtotal)}
            </b>
          </div>

          {/* TOTAL DE REFERENCIA */}
          <div className="resumen-linea total">
            <span>Total de referencia</span>

            <strong>
              {formatoCOP(subtotal)}
            </strong>
          </div>

          {/* ACLARACIÓN DE PRECIOS */}
          <p>
            Precios de referencia con IVA incluido.
            Disponibilidad sujeta a confirmación.

            {tienePreciosPendientes &&
              ' Algunos precios requieren validación comercial.'}
          </p>

          {/* SOLICITAR COTIZACIÓN */}

          <button
            type="button"
            className="boton-verde"
            disabled={!carrito.length || enviando}
            onClick={solicitarCotizacion}
          >
            {enviando
              ? 'Guardando cotización...'
              : 'Solicitar cotización'}
          </button>

          {/* MENSAJE DE ERROR */}
          {errorCotizacion && (
            <p
              role="alert"
              style={{
                color: '#b42318',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              {errorCotizacion}
            </p>
          )}

          {/* INFORMACIÓN PARA EL CLIENTE */}
          <small>
            Para solicitar una cotización debes
            iniciar sesión. La solicitud se
            registrará en nuestra base de datos
            y quedará pendiente de validación
            por el equipo de DEC.
          </small>

        </aside>

      </div>

    </main>
  );
}
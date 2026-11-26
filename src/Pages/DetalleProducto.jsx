import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart
} from 'lucide-react';

import { formatoCOP } from '../data/productos';
import ImagenProducto from '../Components/ImagenProducto';
import TarjetaProducto from '../Components/TarjetaProducto';
import { crearGrafoProductos } from '../Helpers/busqueda';
import { useTienda } from '../Hooks/useTienda';

export default function DetalleProducto() {
  const { id } = useParams();

  const [cantidad, setCantidad] = useState(1);
  const visto = useRef(null);

  // Catálogo compartido de Supabase
  const {
    productos,
    estadoCatalogo,
    agregar,
    registrarVisita
  } = useTienda();

  // Buscar el producto seleccionado
  const producto = productos.find(
    (p) => p.id === id
  );

  // Grafo de productos relacionados
  const grafo = useMemo(() => {
    return crearGrafoProductos(productos);
  }, [productos]);

  // Registrar la visita para el heap
  useEffect(() => {
    if (producto && visto.current !== producto.id) {
      visto.current = producto.id;
      registrarVisita(producto.id);
    }
  }, [producto, registrarVisita]);

  // Productos relacionados
  const relacionados = useMemo(() => {
    if (!producto) return [];

    return grafo
      .relacionados(producto.id, 3)
      .map((productoId) =>
        productos.find((p) => p.id === productoId)
      )
      .filter(Boolean);
  }, [grafo, producto, productos]);

  // Esperar los productos de Supabase
  if (!producto && estadoCatalogo === 'cargando') {
    return (
      <main className="pagina-contenido">
        <h2>Cargando producto...</h2>
      </main>
    );
  }

  // Producto no encontrado
  if (!producto) {
    return (
      <main className="pagina-contenido">
        <h1>Producto no encontrado</h1>

        <p>
          No encontramos el producto solicitado.
        </p>

        <Link to="/productos" className="boton-verde">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const aumentar = () => {
    setCantidad((actual) =>
      Math.min(99, actual + 1)
    );
  };

  const disminuir = () => {
    setCantidad((actual) =>
      Math.max(1, actual - 1)
    );
  };

  const agregarAlCarrito = () => {
    agregar(producto.id, cantidad);
  };

  return (
    <main className="pagina-contenido detalle-pagina">

      <Link to="/productos" className="volver-link">
        <ArrowLeft size={17} />
        Volver al catálogo
      </Link>

      <section className="detalle-cuadricula">

        {/* Imagen principal */}
        <ImagenProducto
          className="detalle-foto"
          src={producto.imagen}
          alt={producto.nombre}
        />

        {/* Información del producto */}
        <div className="detalle-info">

          <h1>{producto.nombre}</h1>

          <div className="detalle-precio">
            {formatoCOP(producto.precio)}
          </div>

          <p className="detalle-disponibilidad">
            Precios con IVA incluido cuando están
            confirmados.
            <br />
            Disponibilidad sujeta a confirmación.
          </p>

          {/* Cantidad y carrito */}
          <div className="detalle-acciones">

            <div className="control-cantidad">
              <button
                type="button"
                onClick={disminuir}
                aria-label="Reducir cantidad"
              >
                <Minus size={16} />
              </button>

              <span>{cantidad}</span>

              <button
                type="button"
                onClick={aumentar}
                aria-label="Aumentar cantidad"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className="boton-verde"
              onClick={agregarAlCarrito}
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>

          </div>

          {/* Descripción */}
          <h2>Descripción del producto</h2>

          <p>
            {producto.descripcion ||
              'Consulta las características y disponibilidad con nuestro equipo.'}
          </p>

        </div>
      </section>

      {/* Recomendaciones mediante grafo */}
      <section className="relacionados-seccion">

        <h2>Productos relacionados</h2>

        {relacionados.length > 0 ? (
          <div className="productos-grid relacionados-grid">
            {relacionados.map((p) => (
              <TarjetaProducto
                key={p.id}
                producto={p}
              />
            ))}
          </div>
        ) : (
          <p>
            Pronto encontrarás más productos relacionados.
          </p>
        )}

      </section>
    </main>
  );
}
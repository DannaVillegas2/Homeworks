import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import TarjetaProducto from '../Components/TarjetaProducto';
import { categorias } from '../data/productos';
import { buscarConTrie, masConsultados } from '../Helpers/busqueda';
import { useTienda } from '../Hooks/useTienda';

export default function Productos() {
  const [params, setParams] = useSearchParams();
  const [mostrar, setMostrar] = useState(8);

  // Catálogo compartido con Supabase
  const {
    productos,
    estadoCatalogo,
    visitas
  } = useTienda();

  const categoria = params.get('categoria') || '';
  const orden = params.get('orden') || 'destacados';
  const q = params.get('q') || '';

  // Buscar y filtrar utilizando las estructuras de datos
  const productosFiltrados = useMemo(() => {
    let lista = buscarConTrie(productos, q);

    if (categoria) {
      lista = lista.filter(
        (p) => p.categoria === categoria
      );
    }

    if (orden === 'alfabetico') {
      lista = [...lista].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es')
      );
    }

    if (orden === 'precio') {
      lista = [...lista].sort(
        (a, b) =>
          (a.precio ?? Infinity) -
          (b.precio ?? Infinity)
      );
    }

    if (orden === 'destacados') {
      lista = [...lista].sort(
        (a, b) =>
          Number(b.destacado) -
          Number(a.destacado)
      );
    }

    if (orden === 'consultados') {
      lista = masConsultados(
        lista,
        visitas,
        lista.length
      ).filter(Boolean);
    }

    return lista;
  }, [productos, categoria, orden, q, visitas]);

  const cambiar = (clave, valor) => {
    const siguiente = new URLSearchParams(params);

    if (valor) {
      siguiente.set(clave, valor);
    } else {
      siguiente.delete(clave);
    }

    setParams(siguiente);
    setMostrar(8);
  };

  return (
    <main className="pagina-contenido catalogo-pagina">
      <h1>Catálogo de productos</h1>

      <p className="subtitulo">
        Encuentra materiales eléctricos para tus proyectos.
      </p>

      {estadoCatalogo === 'cargando' && (
        <p role="status">
          Actualizando catálogo...
        </p>
      )}

      {(estadoCatalogo === 'error' ||
        estadoCatalogo === 'sin-conexion') && (
        <p className="aviso-config" role="alert">
          No se pudo actualizar el catálogo desde Supabase.
          Se muestran los productos locales.
        </p>
      )}

      <div className="barra-filtros">
        <label>
          <span className="sr-only">
            Filtrar por categoría
          </span>

          <select
            value={categoria}
            onChange={(e) =>
              cambiar('categoria', e.target.value)
            }
          >
            <option value="">
              Todas las categorías
            </option>

            {categorias.map((c) => (
              <option key={c.slug} value={c.nombre}>
                {c.nombre}
              </option>
            ))}

            <option value="Extractores">
              Extractores
            </option>

            <option value="Protecciones eléctricas">
              Protecciones eléctricas
            </option>
          </select>
        </label>

        <label>
          <span className="sr-only">
            Ordenar productos
          </span>

          <select
            value={orden}
            onChange={(e) =>
              cambiar('orden', e.target.value)
            }
          >
            <option value="destacados">
              Destacados
            </option>

            <option value="alfabetico">
              Nombre A-Z
            </option>

            <option value="precio">
              Menor precio
            </option>

            <option value="consultados">
              Más consultados aquí
            </option>
          </select>
        </label>
      </div>

      {q && (
        <p className="resultado-busqueda">
          Resultados para: <strong>{q}</strong>
          {' '}({productosFiltrados.length})
        </p>
      )}

      {productosFiltrados.length > 0 ? (
        <div className="productos-grid">
          {productosFiltrados
            .slice(0, mostrar)
            .map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
              />
            ))}
        </div>
      ) : (
        <div className="estado-vacio">
          <h2>No encontramos productos</h2>
          <p>Prueba otra palabra o categoría.</p>
        </div>
      )}

      {mostrar < productosFiltrados.length && (
        <div className="cargar-contenedor">
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              setMostrar((actual) => actual + 8)
            }
          >
            Cargar más productos
          </button>
        </div>
      )}
    </main>
  );
}
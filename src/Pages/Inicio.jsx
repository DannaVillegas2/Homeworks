
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowRight,
  ShoppingCart,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';

import TarjetaProducto from '../Components/TarjetaProducto';
import ImagenProducto from '../Components/ImagenProducto';

import {
  categorias,
  productosDemo
} from '../data/productos';

import { supabase } from '../Services/supabase';

import './Inicio.css';

export default function Inicio() {

  // PRODUCTOS DESTACADOS

  const [destacados, setDestacados] = useState(
    productosDemo.filter((p) => p.destacado)
  );

  // CONSULTAR PRECIOS ACTUALIZADOS

  useEffect(() => {
    let activo = true;

    const cargarDestacados = async () => {
      if (!supabase) return;

      try {
        const productosIniciales = productosDemo.filter(
          (p) => p.destacado
        );

        const ids = productosIniciales.map(
          (p) => p.id
        );

        const {
          data,
          error
        } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price_cop,
            image_url
          `)
          .in('id', ids);

        if (error) throw error;

        // Combinar los productos originales con
        // los datos actualizados de Supabase.
        const actualizados = productosIniciales.map(
          (producto) => {

            const encontrado = (data || []).find(
              (p) => p.id === producto.id
            );

            if (!encontrado) {
              return producto;
            }

            return {
              ...producto,

              // Nombre actualizado
              nombre:
                encontrado.name ?? producto.nombre,

              // Precio actualizado
              precio:
                encontrado.price_cop == null
                  ? null
                  : Number(encontrado.price_cop),

              // Conservar la imagen si no
              // se ha registrado otra en Supabase.
              imagen:
                encontrado.image_url ||
                producto.imagen
            };
          }
        );

        if (activo) {
          setDestacados(actualizados);
        }

      } catch (error) {
        console.error(
          'Error al cargar destacados:',
          error
        );
      }
    };

    cargarDestacados();

    return () => {
      activo = false;
    };
  }, []);

  // INTERFAZ PRINCIPAL

  return (
    <main className="pagina-inicio">

      {/* BANNER PRINCIPAL */}

      <section className="inicio-hero">

        <div className="inicio-hero-contenido">

          <h1>
            Todo en materiales eléctricos
            para tus proyectos
          </h1>

          <p>
            Explora nuestro catálogo de productos
            eléctricos y solicita tu cotización.
            Nuestro equipo confirmará disponibilidad
            y precios antes de aceptar tu pedido.
          </p>

          <Link
            to="/productos"
            className="boton-naranja"
          >
            Ver productos
          </Link>

        </div>

        <div className="inicio-hero-imagen">
          <ImagenProducto
            src="/images/electricista-dec.png"
            alt="Personaje electricista DEC"
          />
        </div>

      </section>

      {/* CATEGORÍAS */}

      <section className="seccion-contenido categorias-inicio">

        <h2>Explora nuestras categorías</h2>

        <div className="categorias-grid">

          {categorias.map((categoria) => (

            <Link
              key={categoria.slug}
              to={`/productos?categoria=${encodeURIComponent(
                categoria.nombre
              )}`}
              className="categoria-tarjeta"
            >

              <ImagenProducto
                src={categoria.imagen}
                alt={categoria.nombre}
              />

              <div className="categoria-bajo">

                <strong>
                  {categoria.nombre}
                </strong>

                <span className="categoria-flecha">
                  <ArrowRight size={19} />
                </span>

              </div>

            </Link>

          ))}

        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}

      <section className="seccion-contenido destacados-inicio">

        <div className="titulo-con-link">

          <h2>Productos destacados</h2>

          <Link to="/productos">
            Ver todos
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="productos-grid">

          {destacados.map((producto) => (

            <TarjetaProducto
              key={producto.id}
              producto={producto}
            />

          ))}

        </div>

      </section>

      {/* PASOS PARA COTIZAR */}

      <section className="seccion-contenido pasos-inicio">

        <h2>
          ¿Cómo funciona tu cotización?
        </h2>

        <div className="pasos-grid">

          <article>

            <ShoppingCart size={33} />

            <h3>
              01. Elige tus productos
            </h3>

            <p>
              Explora nuestro catálogo y agrega
              al carrito los productos que necesitas.
            </p>

          </article>

          <article>

            <ClipboardList size={33} />

            <h3>
              02. Solicita tu cotización
            </h3>

            <p>
              Revisa el carrito y guarda tu
              solicitud con los productos seleccionados.
            </p>

          </article>

          <article>

            <CheckCircle2 size={33} />

            <h3>
              03. Confirma disponibilidad
            </h3>

            <p>
              El equipo de DEC validará precios y
              disponibilidad antes de confirmar.
            </p>

          </article>

        </div>

      </section>

    </main>
  );
}
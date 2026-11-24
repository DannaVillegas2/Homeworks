import {Link} from 'react-router-dom';
import {ArrowRight,ShoppingCart,ClipboardList,CheckCircle2} from 'lucide-react';
import TarjetaProducto from '../Components/TarjetaProducto';
import ImagenProducto from '../Components/ImagenProducto';
import {categorias,productosDemo} from '../data/productos';
import './Inicio.css';

export default function Inicio(){return <main className="pagina-inicio">
  <section className="inicio-hero"><div className="inicio-hero-contenido"><h1>Todo en materiales eléctricos para tus proyectos</h1>
    <p>Explora nuestro catálogo de productos eléctricos y solicita tu cotización. Nuestro equipo confirmará disponibilidad y precios antes de aceptar tu pedido.</p>
    <Link to="/productos" className="boton-naranja">Ver productos</Link></div>
    <div className="inicio-hero-imagen"><ImagenProducto src="/images/electricista-dec.png" alt="Personaje electricista DEC"/></div>
  </section>
  <section className="seccion-contenido categorias-inicio"><h2>Explora nuestras categorías</h2><div className="categorias-grid">
    {categorias.map(c=><Link key={c.slug} to={`/productos?categoria=${encodeURIComponent(c.nombre)}`} className="categoria-tarjeta">
      <ImagenProducto src={c.imagen} alt={c.nombre}/><div className="categoria-bajo"><strong>{c.nombre}</strong><span className="categoria-flecha"><ArrowRight size={19}/></span></div>
    </Link>)}
  </div></section>
  <section className="seccion-contenido destacados-inicio"><div className="titulo-con-link"><h2>Productos destacados</h2><Link to="/productos">Ver todos <ArrowRight size={16}/></Link></div>
    <div className="productos-grid">{productosDemo.filter(p=>p.destacado).map(p=><TarjetaProducto key={p.id} producto={p}/>)}</div>
  </section>
  <section className="seccion-contenido pasos-inicio"><h2>¿Cómo funciona tu cotización?</h2><div className="pasos-grid">
    <article><ShoppingCart size={33}/><h3>01. Elige tus productos</h3><p>Explora nuestro catálogo y agrega al carrito los productos que necesitas.</p></article>
    <article><ClipboardList size={33}/><h3>02. Solicita tu cotización</h3><p>Revisa el carrito y guarda tu solicitud con los productos seleccionados.</p></article>
    <article><CheckCircle2 size={33}/><h3>03. Confirma disponibilidad</h3><p>El equipo de DEC validará precios y disponibilidad antes de confirmar.</p></article>
  </div></section>
</main>}

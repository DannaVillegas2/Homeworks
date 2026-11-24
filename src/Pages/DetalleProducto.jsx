import {useEffect,useRef,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,Minus,Plus,ShoppingCart} from 'lucide-react';
import {productosDemo,formatoCOP} from '../data/productos';
import ImagenProducto from '../Components/ImagenProducto';
import TarjetaProducto from '../Components/TarjetaProducto';
import {crearGrafoProductos} from '../Helpers/busqueda';
import {useTienda} from '../Hooks/useTienda';

const grafo=crearGrafoProductos(productosDemo);

export default function DetalleProducto(){
  const {id}=useParams();const p=productosDemo.find(prod=>prod.id===id);const [cantidad,setCantidad]=useState(1);
  const {agregar,registrarVisita}=useTienda();const visto=useRef(null);
  useEffect(()=>{if(p&&visto.current!==p.id){visto.current=p.id;registrarVisita(p.id);}},[p,registrarVisita]);
  if(!p)return <main className="pagina-contenido"><h1>Producto no encontrado</h1><Link to="/productos">Volver al catálogo</Link></main>;
  const relacionados=grafo.relacionados(p.id,3).map(pid=>productosDemo.find(e=>e.id===pid)).filter(Boolean);
  return <main className="pagina-contenido detalle-pagina">
    <Link className="volver-link" to="/productos"><ArrowLeft size={17}/> Volver al catálogo</Link>
    <section className="detalle-cuadricula"><ImagenProducto className="detalle-foto" src={p.imagen} alt={p.nombre}/>
      <div className="detalle-info"><h1>{p.nombre}</h1><div className="detalle-precio">{formatoCOP(p.precio)}</div>
        <p className="detalle-disponibilidad">Precio con IVA incluido cuando está confirmado.<br/>Disponibilidad sujeta a confirmación.</p>
        <div className="detalle-acciones"><div className="control-cantidad"><button onClick={()=>setCantidad(c=>Math.max(1,c-1))} aria-label="Reducir cantidad"><Minus size={16}/></button><span>{cantidad}</span><button onClick={()=>setCantidad(c=>Math.min(99,c+1))} aria-label="Aumentar cantidad"><Plus size={16}/></button></div>
          <button onClick={()=>agregar(p.id,cantidad)} className="boton-verde"><ShoppingCart size={18}/> Agregar al carrito</button>
        </div>
        <h2>Descripción del producto</h2><p>{p.descripcion}</p>
      </div>
    </section>
    <section className="relacionados-seccion"><h2>Productos relacionados</h2>{relacionados.length?<div className="productos-grid relacionados-grid">{relacionados.map(r=><TarjetaProducto key={r.id} producto={r}/>)}</div>:<p>Pronto encontrarás más artículos relacionados.</p>}</section>
  </main>;
}

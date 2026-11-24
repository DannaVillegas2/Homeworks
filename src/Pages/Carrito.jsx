import {useNavigate,Link} from 'react-router-dom';
import {Trash2,Minus,Plus,Undo2,ShoppingCart} from 'lucide-react';
import ImagenProducto from '../Components/ImagenProducto';
import {productosDemo,formatoCOP} from '../data/productos';
import {useTienda} from '../Hooks/useTienda';

export default function Carrito(){
  const {carrito,totalItems,subtotal,tienePreciosPendientes,cambiarCantidad,quitar,deshacer,puedeDeshacer,crearCotizacion}=useTienda();const ir=useNavigate();
  const solicitar=()=>{const cot=crearCotizacion();if(cot)ir(`/cotizacion/${cot.id}/imprimir`);};
  
  return <main className="pagina-contenido carrito-pagina"><h1>Mi carrito de compras</h1>
    <div className="carrito-grid"><div className="carrito-izquierda">
      {carrito.length?carrito.map(f=>{const p=productosDemo.find(x=>x.id===f.id);if(!p)return null;return <article key={f.id} className="carrito-fila">
        <Link to={`/productos/${p.id}`} aria-label={`Ver ${p.nombre}`}><ImagenProducto className="carrito-foto" src={p.imagen} alt={p.nombre}/></Link>
        <div className="carrito-fila-info"><Link to={`/productos/${p.id}`}><h2>{p.nombre}</h2></Link><strong>{formatoCOP(p.precio)}</strong>
          <div className="control-cantidad"><button aria-label="Reducir cantidad" onClick={()=>cambiarCantidad(f.id,f.cantidad-1)}><Minus size={15}/></button><span>{f.cantidad}</span><button aria-label="Aumentar cantidad" onClick={()=>cambiarCantidad(f.id,f.cantidad+1)}><Plus size={15}/></button></div></div>
        <button className="eliminar-producto" aria-label={`Eliminar ${p.nombre}`} onClick={()=>quitar(p.id)}><Trash2 size={20}/></button></article>;}):<div className="estado-vacio carrito-vacio"><ShoppingCart size={46}/><h2>Tu carrito está vacío</h2><p>Explora nuestro catálogo y agrega lo que necesites.</p><Link className="boton-verde" to="/productos">Ver productos</Link></div>}
      {puedeDeshacer&&<button className="boton-enlace deshacer" onClick={deshacer}><Undo2 size={16}/> Deshacer último cambio</button>}
    </div>
    <aside className="resumen-cotizacion"><h2>Resumen de cotización</h2><div className="resumen-linea"><span>Subtotal ({totalItems} {totalItems===1?'producto':'productos'})</span><b>{formatoCOP(subtotal)}</b></div><div className="resumen-linea total"><span>Total conocido</span><strong>{formatoCOP(subtotal)}</strong></div>
      <p>Precios con IVA incluido. Disponibilidad sujeta a confirmación.{tienePreciosPendientes?' Hay artículos con precio por confirmar.':''}</p>
      <button className="boton-verde" disabled={!carrito.length} onClick={solicitar}>Solicitar cotización</button>
      <small>Demostración local: la solicitud no se envía todavía al negocio.</small>
    </aside></div>
  </main>;
}

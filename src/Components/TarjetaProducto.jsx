import {Link} from 'react-router-dom';
import {ShoppingCart} from 'lucide-react';
import ImagenProducto from './ImagenProducto';
import {formatoCOP} from '../data/productos';
import {useTienda} from '../Hooks/useTienda';
export default function TarjetaProducto({producto}){
  const {agregar}=useTienda();
  return <article className="tarjeta-producto">
    <Link className="tarjeta-imagen-link" to={`/productos/${producto.id}`}><ImagenProducto src={producto.imagen} alt={producto.nombre}/></Link>
    <div className="tarjeta-contenido"><Link to={`/productos/${producto.id}`} className="tarjeta-titulo">{producto.nombre}</Link>
      <span className={`tarjeta-precio ${producto.precio==null?'sin-precio':''}`}>{formatoCOP(producto.precio)}</span>
      <button className="boton-verde" type="button" onClick={()=>agregar(producto.id)}><ShoppingCart size={16}/> Agregar al carrito</button>
    </div>
  </article>;
}

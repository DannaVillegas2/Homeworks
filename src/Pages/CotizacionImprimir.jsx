import {Link,useParams} from 'react-router-dom';
import {useTienda} from '../Hooks/useTienda';
import {formatoCOP} from '../data/productos';

export default function CotizacionImprimir(){const {id}=useParams();const {cotizaciones}=useTienda();const cot=cotizaciones.find(c=>c.id===id);

if(!cot)return <main className="pagina-contenido"><h1>Cotización no encontrada</h1><Link to="/cotizaciones">Volver</Link></main>;
 const subtotal=cot.items.reduce((s,p)=>s+(p.precio||0)*p.cantidad,0);
 return <main className="pdf-pagina"><div className="pdf-acciones"><button className="boton-verde" onClick={()=>window.print()}>Imprimir / Guardar como PDF</button><Link to="/cotizaciones">Volver al historial</Link></div>
  <header className="pdf-encabezado"><h1>DEC S.A.S.</h1><p>Distribuidor Eléctrico de Cali S.A.S.</p><h2>Solicitud de cotización — {cot.id}</h2><p>Fecha: {new Date(cot.fecha).toLocaleDateString('es-CO')}</p><p>Estado: {cot.estado}</p></header>
  <table><thead><tr><th>Producto</th><th>Cantidad</th><th>Valor referencia</th><th>Subtotal</th></tr></thead><tbody>{cot.items.map(p=><tr key={p.id}><td>{p.nombre}</td><td>{p.cantidad}</td><td>{formatoCOP(p.precio)}</td><td>{p.precio==null?'Por confirmar':formatoCOP(p.precio*p.cantidad)}</td></tr>)}</tbody></table>
  <h3>Total de precios conocidos: {formatoCOP(subtotal)}</h3><p>Valores de referencia con IVA incluido, sujetos a confirmación comercial. Productos sin precio: se cotizan directamente con DEC. Disponibilidad y aceptación pendientes de confirmación.</p>
  <p className="pdf-nota">Documento de demostración generado localmente. Este archivo no acredita confirmación ni envío por correo a DEC.</p>
  <p>Contacto: 315 373 5319 · distribuidorelectricodecali@hotmail.com</p>
 </main>;
}

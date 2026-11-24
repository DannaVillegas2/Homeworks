import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Clock3,CheckCircle2,Package} from 'lucide-react';
import {useTienda} from '../Hooks/useTienda';

export default function PanelAdmin({demo=false}){

  const {cotizaciones}=useTienda();const [aviso,setAviso]=useState('');
  const pendientes=cotizaciones.filter(c=>c.estado==='Pendiente').length;
  const confirmadas=cotizaciones.filter(c=>c.estado==='Confirmada').length;

  return <main className="pagina-contenido admin-pagina"><div className="admin-encabezado"><div><h1>Panel administrativo</h1><p className="subtitulo">Gestiona las cotizaciones, productos y solicitudes de tus clientes.</p></div>
   
    <button className="boton-verde" onClick={()=>setAviso('La edición del catálogo se activará al configurar la base de datos y los permisos administrativos.')}>Gestionar productos</button></div>
    {demo&&<p className="banner-demo">Vista de demostración sin permisos administrativos reales. Los datos son locales.</p>}
    {aviso&&<p role="status" className="banner-demo">{aviso}</p>}
    <div className="admin-indicadores">
      <div className="indicador indicador-pendiente"><Clock3 size={22}/><span>Cotizaciones pendientes</span><strong>{pendientes}</strong></div>
      <div className="indicador"><CheckCircle2 size={22}/><span>Cotizaciones confirmadas</span><strong>{confirmadas}</strong></div>
      <div className="indicador"><Package size={22}/><span>Productos activos (dato del catálogo recibido)</span><strong>2.608</strong></div>
    </div>
    <h2 className="admin-subtitulo">Cotizaciones recientes</h2>
    <div className="tabla-contenedor"><table><thead><tr><th>N.º cotización</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
      {cotizaciones.length?cotizaciones.slice(-8).reverse().map(c=><tr key={c.id}><td>{c.id}</td><td>{new Date(c.fecha).toLocaleDateString('es-CO')}</td><td><span className="estado estado-pendiente">{c.estado}</span></td><td><Link to={`/cotizacion/${c.id}/imprimir`}>Revisar</Link></td></tr>):<tr><td colSpan="4" className="sin-registros">No hay cotizaciones locales para revisar.</td></tr>}
    </tbody></table></div>
    <p className="aclaracion-catalogo">El panel productivo requiere un rol administrador verificado por Supabase, datos de cotización en PostgreSQL y una función de envío de correos. No están simulados como operaciones reales.</p>
  </main>;
}

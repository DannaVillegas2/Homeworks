import {Link} from 'react-router-dom';
import {useTienda} from '../Hooks/useTienda';

const fechaBonita=iso=>new Date(iso).toLocaleDateString('es-CO');

export default function Cotizaciones({demo=false}){
  const {cotizaciones}=useTienda();
  return <main className="pagina-contenido historial-pagina"><h1>Mis cotizaciones</h1><p className="subtitulo">Consulta el historial y estado de tus solicitudes de cotización.</p>
  {demo&&<p className="banner-demo">Vista de demostración: los registros de este navegador no están sincronizados con la empresa.</p>}
  <div className="tabla-contenedor"><table><thead><tr><th>N.º cotización</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead>
    <tbody>{cotizaciones.length?cotizaciones.map(c=><tr key={c.id}><td>{c.id}</td><td>{fechaBonita(c.fecha)}</td><td><span className={`estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span></td><td><Link to={`/cotizacion/${c.id}/imprimir`}>Ver PDF</Link></td></tr>):<tr><td colSpan="4" className="sin-registros">Todavía no hay cotizaciones guardadas en este navegador. <Link to="/productos">Explorar productos</Link></td></tr>}</tbody>
  </table></div><small>Los registros locales no representan cotizaciones confirmadas por DEC. Los PDF se generan usando la opción «Imprimir / Guardar como PDF» del navegador.</small>
  </main>;
}

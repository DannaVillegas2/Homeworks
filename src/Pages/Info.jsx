import {Link} from 'react-router-dom';
import {categorias,productosDemo} from '../data/productos';
import ImagenProducto from '../Components/ImagenProducto';

const titulos={categorias:'Categorías',marcas:'Marcas',nosotros:'Nosotros',contacto:'Contáctanos','404':'Página no encontrada'};

export default function Info({tipo}){
  const marcas=[...new Set(productosDemo.map(p=>p.marca).filter(Boolean))].sort();
  return <main className="pagina-contenido info-pagina"><h1>{titulos[tipo]}</h1>
    {tipo==='categorias'&&<div className="categorias-grid">{categorias.map(c=><Link className="categoria-tarjeta" key={c.slug} to={`/productos?categoria=${encodeURIComponent(c.nombre)}`}><ImagenProducto src={c.imagen} alt={c.nombre}/><div className="categoria-bajo"><strong>{c.nombre}</strong></div></Link>)}</div>}
    {tipo==='marcas'&&<div className="marcas-lista">{marcas.map(m=><Link key={m} to={`/productos?q=${encodeURIComponent(m)}`}>{m}</Link>)}</div>}
    {tipo==='nosotros'&&<p>Distribuidor Eléctrico de Cali S.A.S. ofrece materiales eléctricos e iluminación para proyectos en Cali. Solicita tu cotización y nuestro equipo confirmará disponibilidad.</p>}
    {tipo==='contacto'&&<><p>Cali, Valle del Cauca, Colombia</p><p>WhatsApp: <a href="https://wa.me/573153735319">315 373 5319</a></p><p>Correo: <a href="mailto:distribuidorelectricodecali@hotmail.com">distribuidorelectricodecali@hotmail.com</a></p></>}
    {tipo==='404'&&<p>No encontramos esta dirección. <Link to="/">Volver a inicio</Link></p>}
  </main>;
}

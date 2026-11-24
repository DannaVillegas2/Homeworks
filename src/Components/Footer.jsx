import {Link} from 'react-router-dom';
import {MapPin,Phone,Mail} from 'lucide-react';
export default function Footer(){return <footer className="footer-dec"><div className="footer-contenido">
  <section><h2>DEC S.A.S.</h2><p>Distribuidor Eléctrico de Cali S.A.S.</p></section>
  <section><h3>Enlaces</h3><div className="footer-enlaces"><Link to="/">Inicio</Link><Link to="/productos">Productos</Link><Link to="/categorias">Categorías</Link><Link to="/contacto">Contacto</Link></div></section>
  <section><h3>Contáctanos</h3><div className="footer-enlaces">
    <p><MapPin size={15}/> Cali, Valle del Cauca, Colombia</p>
    <a href="https://wa.me/573153735319" target="_blank" rel="noreferrer"><Phone size={15}/> WhatsApp: 315 373 5319</a>
    <a href="mailto:distribuidorelectricodecali@hotmail.com"><Mail size={15}/> distribuidorelectricodecali@hotmail.com</a>
  </div></section>
  <div className="footer-base">© {new Date().getFullYear()} Distribuidor Eléctrico de Cali S.A.S. — Todos los derechos reservados. <Link to="/vista-historial-demo">Historial demo</Link> · <Link to="/vista-admin-demo">Panel demo</Link></div>
</div></footer>}

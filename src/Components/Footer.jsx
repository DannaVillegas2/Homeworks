import { Link } from 'react-router-dom';

import {
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';

const GOOGLE_MAPS =
  'https://maps.app.goo.gl/Qfhj4Rs5PPV6i9dk7';

export default function Footer() {
  return (
    <footer className="footer-dec">
      <div className="footer-contenido">

        {/* INFORMACIÓN DE LA EMPRESA */}
        <section>
          <h2>DEC S.A.S.</h2>

          <p>
            Distribuidor Eléctrico de Cali S.A.S.
          </p>

          <p style={{ marginTop: 12 }}>
            Materiales eléctricos e iluminación
            para tus proyectos.
          </p>
        </section>

        {/* ENLACES */}
        <section>
          <h3>Enlaces</h3>

          <div className="footer-enlaces">
            <Link to="/">
              Inicio
            </Link>

            <Link to="/productos">
              Productos
            </Link>

            <Link to="/categorias">
              Categorías
            </Link>

            <Link to="/contacto">
              Contacto
            </Link>
          </div>
        </section>

        {/* CONTACTO Y UBICACIÓN */}
        <section>
          <h3>Contáctanos</h3>

          <div className="footer-enlaces">

            <p>
              <MapPin size={16} />

              <span>
                Carrera 6 #18-91,
                barrio San Nicolás,
                Cali, Valle del Cauca,
                Colombia.
              </span>
            </p>

            <a
              href={GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />

              Ver ubicación en Google Maps
            </a>

            <a
              href="https://wa.me/573153735319"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={16} />

              WhatsApp: 315 373 5319
            </a>

            <a
              href="mailto:distribuidorelectricodecali@hotmail.com"
            >
              <Mail size={16} />

              distribuidorelectricodecali@hotmail.com
            </a>

          </div>
        </section>

        {/* DERECHOS RESERVADOS */}
        <div className="footer-base">

          © {new Date().getFullYear()}{' '}
          Distribuidor Eléctrico de Cali S.A.S.
          {' '}— Todos los derechos reservados.

          <Link to="/vista-historial-demo">
            Historial demo
          </Link>

          {' · '}

          <Link to="/vista-admin-demo">
            Panel demo
          </Link>

        </div>

      </div>
    </footer>
  );
}
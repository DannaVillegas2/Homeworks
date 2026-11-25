import {
  Store,
  MapPin,
  ExternalLink
} from 'lucide-react';

import './AvisoEntregas.css';

const DIRECCION =
  'Carrera 6 #18-91, barrio San Nicolás, Cali';

const GOOGLE_MAPS =
  'https://maps.app.goo.gl/Qfhj4Rs5PPV6i9dk7';

export default function AvisoEntregas() {
  return (
    <aside
      className="dec-aviso-entregas"
      aria-label="Información sobre entregas y recogida de pedidos"
    >
      <div className="dec-aviso-entregas__contenido">

        <div className="dec-aviso-entregas__principal">

          <div
            className="dec-aviso-entregas__icono"
            aria-hidden="true"
          >
            <Store size={27} />
          </div>

          <div className="dec-aviso-entregas__texto">
            <h2>
              Información importante sobre las entregas
            </h2>

            <p>
              <strong>
                No realizamos domicilios.
              </strong>
              {' '}
              Los pedidos se recogen en nuestro
              punto físico o se entregan allí
              a un repartidor contratado
              por el cliente.
            </p>
          </div>

        </div>

        <div className="dec-aviso-entregas__ubicacion">

          <div className="dec-aviso-entregas__direccion">
            <MapPin
              size={21}
              aria-hidden="true"
            />

            <div>
              <span>
                Visítanos en:
              </span>

              <strong>
                {DIRECCION}
              </strong>
            </div>
          </div>

          <a
            className="dec-aviso-entregas__boton"
            href={GOOGLE_MAPS}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver ubicación de DEC en Google Maps"
          >
            Ver en Google Maps

            <ExternalLink
              size={17}
              aria-hidden="true"
            />
          </a>

        </div>

      </div>
    </aside>
  );
}
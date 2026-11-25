import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAuth } from '../Hooks/useAuth';
import { useTienda } from '../Hooks/useTienda';
import { supabase } from '../Services/supabase';
import { formatoCOP } from '../data/productos';

const dinero = (valor) =>
  formatoCOP(
    valor == null ? null : Number(valor)
  );

const fechaBonita = (fecha) => {
  if (!fecha) return 'Sin fecha';

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return 'Sin fecha';
  }

  return valor.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Bogota'
  });
};

const descripcionRevision = (cotizacion) => {
  if (cotizacion.review_status === 'enviada') {
    return 'Revisión enviada al cliente';
  }

  if (
    cotizacion.review_status ===
    'lista_para_enviar'
  ) {
    return 'Revisada por DEC - pendiente de envío';
  }

  return 'Pendiente de revisión comercial';
};

export default function CotizacionImprimir() {
  const { id } = useParams();

  const {
    usuario,
    esAdmin,
    cargando: cargandoSesion
  } = useAuth();

  const { cotizaciones } = useTienda();

  const [cotizacion, setCotizacion] = useState(null);
  const [items, setItems] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarCotizacion = async () => {
      setCargando(true);
      setError('');
      setCotizacion(null);
      setItems([]);

      // SOPORTE PARA COTIZACIONES DEMO

      if (id?.startsWith('COT-')) {
        const local = cotizaciones.find(
          (c) => c.id === id
        );

        if (!activo) return;

        if (!local) {
          setError('Cotización local no encontrada.');
          setCargando(false);
          return;
        }

        setCotizacion({
          id: local.id,
          created_at: local.fecha,
          status: local.estado || 'pendiente',
          review_status: 'sin_revisar',
          review_message: null,
          total_known_cop: null,
          demo: true
        });

        setItems(
          (local.items || []).map((p, index) => ({
            id: p.id || index,
            product_name: p.nombre,
            quantity: Number(p.cantidad),
            unit_price_cop: p.precio,
            discount_percent: 0,
            line_total_cop:
              p.precio == null
                ? null
                : Number(p.precio) * Number(p.cantidad),
            original_unit_price_cop: p.precio
          }))
        );

        setCargando(false);
        return;
      }

      // COTIZACIONES REALES

      if (cargandoSesion) return;

      if (!usuario) {
        if (activo) {
          setError(
            'Inicia sesión para consultar esta cotización.'
          );
          setCargando(false);
        }
        return;
      }

      if (!supabase) {
        if (activo) {
          setError('Supabase no está configurado.');
          setCargando(false);
        }
        return;
      }

      try {
        let consulta = supabase
          .from('quotes')
          .select(`
            id,
            user_id,
            status,
            created_at,
            customer_note,
            total_known_cop,
            review_status,
            review_message,
            sent_at
          `)
          .eq('id', id);

        // El cliente solo consulta su cotización.
        // La RLS sigue aplicándose en Supabase.
        if (!esAdmin) {
          consulta = consulta.eq(
            'user_id',
            usuario.id
          );
        }

        const {
          data: datosCotizacion,
          error: errorCotizacion
        } = await consulta.single();

        if (errorCotizacion) {
          throw errorCotizacion;
        }

        const {
          data: datosItems,
          error: errorItems
        } = await supabase
          .from('quote_items')
          .select(`
            id,
            product_name,
            quantity,
            unit_price_cop,
            discount_percent,
            line_total_cop,
            original_unit_price_cop,
            original_discount_percent
          `)
          .eq('quote_id', id);

        if (errorItems) throw errorItems;

        if (!activo) return;

        setCotizacion(datosCotizacion);
        setItems(datosItems || []);

      } catch (err) {
        if (!activo) return;

        console.error(
          'Error al cargar PDF:',
          err
        );

        setError(
          'No se pudo consultar la cotización. Verifica que exista y que tengas acceso.'
        );

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarCotizacion();

    return () => {
      activo = false;
    };
  }, [
    id,
    usuario?.id,
    esAdmin,
    cargandoSesion,
    cotizaciones
  ]);

  // CALCULAR VALORES A MOSTRAR

  const totalCalculado = items.reduce(
    (suma, p) =>
      suma + Number(p.line_total_cop ?? 0),
    0
  );

  const total =
    cotizacion?.total_known_cop == null
      ? totalCalculado
      : Number(cotizacion.total_known_cop);

  const hayPreciosPendientes = items.some(
    (p) =>
      p.unit_price_cop == null ||
      p.line_total_cop == null
  );

  const volver = cotizacion?.demo
    ? '/vista-historial-demo'
    : '/cotizaciones';

  if (cargando) {
    return (
      <main className="pagina-contenido">
        <p>Cargando cotización...</p>
      </main>
    );
  }

  if (error || !cotizacion) {
    return (
      <main className="pagina-contenido">
        <h1>No se pudo abrir la cotización</h1>
        <p>{error || 'Cotización no encontrada.'}</p>
        <Link to="/cotizaciones">
          Volver al historial
        </Link>
      </main>
    );
  }

  // DOCUMENTO PARA IMPRIMIR

  return (
    <main className="pdf-pagina">

      <div className="pdf-acciones">
        <button
          type="button"
          className="boton-verde"
          onClick={() => window.print()}
        >
          Imprimir / Guardar como PDF
        </button>

        <Link to={volver}>
          Volver al historial
        </Link>
      </div>

      <header className="pdf-encabezado">
        <h1>DEC S.A.S.</h1>

        <p>
          Distribuidor Eléctrico de Cali S.A.S.
        </p>

        <h2>
          Cotización — {cotizacion.id}
        </h2>

        <p>
          <strong>Fecha:</strong>{' '}
          {fechaBonita(cotizacion.created_at)}
        </p>

        <p>
          <strong>Estado:</strong>{' '}
          {cotizacion.status}
        </p>

        {!cotizacion.demo && (
          <p>
            <strong>Revisión comercial:</strong>{' '}
            {descripcionRevision(cotizacion)}
          </p>
        )}
      </header>

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Descuento</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p, index) => (
              <tr key={p.id ?? index}>
                <td>
                  {p.product_name}
                </td>

                <td>
                  {p.quantity}
                </td>

                <td>
                  {dinero(p.unit_price_cop)}
                </td>

                <td>
                  {Number(
                    p.discount_percent ?? 0
                  )}%
                </td>

                <td>
                  {dinero(p.line_total_cop)}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="5">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        textAlign: 'right',
        marginTop: 24
      }}>
        <h3>
          {hayPreciosPendientes
            ? 'Total de valores conocidos: '
            : 'Total revisado: '}
          {dinero(total)}
        </h3>
      </div>

      {!cotizacion.demo &&
        cotizacion.review_message && (
          <section style={{
            marginTop: 24
          }}>
            <h3>
              Observaciones comerciales de DEC
            </h3>

            <p style={{
              whiteSpace: 'pre-wrap'
            }}>
              {cotizacion.review_message}
            </p>
          </section>
        )}

      {cotizacion.customer_note && (
        <section style={{ marginTop: 18 }}>
          <h3>Observación del cliente</h3>

          <p>
            {cotizacion.customer_note}
          </p>
        </section>
      )}

      {cotizacion.demo ? (
        <p className="pdf-nota">
          Documento de demostración generado
          localmente. No acredita aprobación
          comercial ni envío a DEC.
        </p>
      ) : (
        <p className="pdf-nota">
          Precios expresados en pesos colombianos
          con IVA incluido según los valores
          registrados. La disponibilidad y
          aceptación de la propuesta están sujetas
          a confirmación comercial.
          {hayPreciosPendientes
            ? ' Algunos productos todavía tienen valores por confirmar.'
            : ''}
        </p>
      )}

      <p>
        Contacto: 315 373 5319
        {' · '}
        distribuidorelectricodecali@hotmail.com
      </p>

    </main>
  );
}
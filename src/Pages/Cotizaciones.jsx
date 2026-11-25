import {
  useEffect,
  useState
} from 'react';

import { Link } from 'react-router-dom';

import {
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { useAuth } from '../Hooks/useAuth';
import { useTienda } from '../Hooks/useTienda';
import { supabase } from '../Services/supabase';

// FUNCIONES AUXILIARES

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

const revisionBonita = (cotizacion) => {
  if (
    cotizacion.review_status === 'enviada'
  ) {
    return 'Propuesta enviada';
  }

  if (
    cotizacion.review_status ===
    'lista_para_enviar'
  ) {
    return 'Revisada por DEC';
  }

  return 'Sin revisar';
};

const decisionBonita = (cotizacion) => {
  if (
    cotizacion.client_decision === 'aceptada'
  ) {
    return 'Aceptada por ti';
  }

  if (
    cotizacion.client_decision === 'rechazada'
  ) {
    return 'Rechazada por ti';
  }

  if (
    cotizacion.review_status === 'enviada' &&
    cotizacion.sent_at
  ) {
    return 'Pendiente de respuesta';
  }

  return 'Sin respuesta';
};

// HISTORIAL DEL CLIENTE

export default function Cotizaciones({
  demo = false
}) {
  const {
    usuario,
    cargando: cargandoSesion
  } = useAuth();

  const {
    cotizaciones
  } = useTienda();

  // ESTADOS

  const [registros, setRegistros] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const [recarga, setRecarga] =
    useState(0);

  const [procesandoId, setProcesandoId] =
    useState(null);

  // CARGAR COTIZACIONES DEL CLIENTE

  useEffect(() => {
    let activo = true;

    if (demo) {
      setCargando(false);
      return;
    }

    if (cargandoSesion) {
      return;
    }

    if (!usuario || !supabase) {
      setRegistros([]);
      setCargando(false);
      return;
    }

    const cargarHistorial = async () => {
      setCargando(true);
      setError('');

      try {
        const {
          data,
          error: errorConsulta
        } = await supabase
          .from('quotes')
          .select(`
            id,
            user_id,
            status,
            created_at,
            total_known_cop,
            review_status,
            review_message,
            sent_at,
            client_decision,
            client_responded_at
          `)
          .eq('user_id', usuario.id)
          .order('created_at', {
            ascending: false
          });

        if (errorConsulta) {
          throw errorConsulta;
        }

        if (activo) {
          setRegistros(data || []);
        }

      } catch (err) {
        console.error(
          'Error al cargar historial:',
          err
        );

        if (activo) {
          setError(
            err.message ||
            'No se pudo consultar el historial.'
          );
        }

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarHistorial();

    return () => {
      activo = false;
    };

  }, [
    demo,
    usuario?.id,
    cargandoSesion,
    recarga
  ]);

  // RESPONDER UNA COTIZACIÓN

  const responderCotizacion = async (
    cotizacion,
    respuesta
  ) => {
    if (
      demo ||
      !supabase ||
      !usuario ||
      procesandoId
    ) {
      return;
    }

    if (
      cotizacion.status !== 'pendiente' ||
      cotizacion.review_status !== 'enviada' ||
      !cotizacion.sent_at ||
      cotizacion.client_decision !==
        'sin_responder'
    ) {
      setError(
        'Esta cotización no está disponible para responder.'
      );
      return;
    }

    const aceptando =
      respuesta === 'aceptada';

    const confirmado = window.confirm(
      aceptando
        ? '¿Confirmas que deseas ACEPTAR esta cotización? Tu respuesta quedará registrada en DEC.'
        : '¿Confirmas que deseas RECHAZAR esta cotización? Tu respuesta quedará registrada en DEC.'
    );

    if (!confirmado) {
      return;
    }

    setProcesandoId(cotizacion.id);

    setError('');
    setMensaje('');

    try {
      const {
        data,
        error: errorRespuesta
      } = await supabase.rpc(
        'responder_cotizacion_dec',
        {
          p_quote_id: cotizacion.id,
          p_respuesta: respuesta
        }
      );

      if (errorRespuesta) {
        throw errorRespuesta;
      }

      // Actualizar la fila sin recargar la página.
      setRegistros((actual) =>
        actual.map((c) =>
          c.id === cotizacion.id
            ? {
                ...c,
                client_decision:
                  data.client_decision,
                client_responded_at:
                  data.client_responded_at
              }
            : c
        )
      );

      setMensaje(
        aceptando
          ? 'Aceptaste la cotización. DEC podrá consultar tu respuesta y continuar con la confirmación comercial.'
          : 'Rechazaste la cotización. Tu decisión quedó registrada correctamente.'
      );

    } catch (err) {
      console.error(
        'Error al responder cotización:',
        err
      );

      setError(
        err.message ||
        'No se pudo guardar tu respuesta.'
      );

    } finally {
      setProcesandoId(null);
    }
  };

  // COTIZACIONES REALES / DEMOSTRACIÓN

  const lista = demo
    ? cotizaciones.map((c) => ({
        id: c.id,
        created_at: c.fecha,
        status:
          (c.estado || 'pendiente').toLowerCase(),
        review_status: 'sin_revisar',
        client_decision: 'sin_responder',
        sent_at: null
      }))
    : registros;

  // INTERFAZ

  return (
    <main className="pagina-contenido historial-pagina">

      {/* ENCABEZADO */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14
      }}>

        <div>
          <h1>Mis cotizaciones</h1>

          <p className="subtitulo">
            Consulta tus solicitudes, revisa
            las propuestas comerciales de DEC
            y responde las cotizaciones enviadas.
          </p>
        </div>

        {!demo && (
          <button
            type="button"
            className="boton-secundario"
            disabled={
              cargando ||
              !!procesandoId
            }
            onClick={() => {
              setMensaje('');
              setRecarga((n) => n + 1);
            }}
          >
            <RefreshCw size={17} />
            Actualizar historial
          </button>
        )}

      </div>

      {/* DEMOSTRACIÓN */}
      {demo && (
        <p className="banner-demo">
          Vista de demostración: estos registros
          son locales y no están sincronizados
          con DEC.
        </p>
      )}

      {/* ERRORES */}
      {error && (
        <p
          role="alert"
          style={{
            marginTop: 18,
            color: '#b42318',
            fontWeight: 600
          }}
        >
          {error}
        </p>
      )}

      {/* CONFIRMACIÓN */}
      {mensaje && (
        <p
          role="status"
          style={{
            marginTop: 18,
            color: '#168b34',
            fontWeight: 600
          }}
        >
          {mensaje}
        </p>
      )}

      {/* CARGANDO */}
      {cargando && !demo && (
        <p>
          Cargando tus cotizaciones...
        </p>
      )}

      {/* TABLA DE COTIZACIONES */}

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>N.º cotización</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Revisión comercial</th>
              <th>Tu respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lista.length > 0 ? (
              lista.map((c) => {
                // Solo puede responder si DEC
                // ya registró el envío real.
                const puedeResponder =
                  !demo &&
                  c.status === 'pendiente' &&
                  c.review_status === 'enviada' &&
                  Boolean(c.sent_at) &&
                  c.client_decision ===
                    'sin_responder';

                const aceptada =
                  c.client_decision === 'aceptada';

                const rechazada =
                  c.client_decision === 'rechazada';

                const procesando =
                  procesandoId === c.id;

                return (
                  <tr key={c.id}>

                    {/* IDENTIFICADOR */}
                    <td>
                      {c.id}
                    </td>

                    {/* FECHA */}
                    <td>
                      {fechaBonita(
                        c.created_at
                      )}
                    </td>

                    {/* ESTADO COMERCIAL */}
                    <td>
                      <span
                        className={
                          `estado estado-${c.status}`
                        }
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* REVISIÓN */}
                    <td>
                      {revisionBonita(c)}
                    </td>

                    {/* RESPUESTA DEL CLIENTE */}
                    <td>
                      {aceptada ? (
                        <span style={{
                          display: 'inline-flex',
                          gap: 6,
                          alignItems: 'center',
                          color: '#168b34',
                          fontWeight: 600
                        }}>
                          <CheckCircle2 size={17} />
                          Aceptada
                        </span>
                      ) : rechazada ? (
                        <span style={{
                          display: 'inline-flex',
                          gap: 6,
                          alignItems: 'center',
                          color: '#b42318',
                          fontWeight: 600
                        }}>
                          <XCircle size={17} />
                          Rechazada
                        </span>
                      ) : (
                        decisionBonita(c)
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 10
                      }}>

                        {/* VER PDF */}
                        <Link
                          to={
                            `/cotizacion/${c.id}/imprimir`
                          }
                        >
                          Ver PDF
                        </Link>

                        {/* RESPONDER PROPUESTA */}
                        {puedeResponder && (
                          <>
                            <button
                              type="button"
                              className="boton-verde"
                              disabled={
                                !!procesandoId
                              }
                              onClick={() =>
                                responderCotizacion(
                                  c,
                                  'aceptada'
                                )
                              }
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <CheckCircle2 size={16} />

                              {procesando
                                ? 'Guardando...'
                                : 'Aceptar'}
                            </button>

                            <button
                              type="button"
                              className="boton-secundario"
                              disabled={
                                !!procesandoId
                              }
                              onClick={() =>
                                responderCotizacion(
                                  c,
                                  'rechazada'
                                )
                              }
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                              }}
                            >
                              <XCircle size={16} />
                              Rechazar
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="sin-registros"
                >
                  {cargando
                    ? 'Consultando cotizaciones...'
                    : 'Todavía no tienes cotizaciones registradas.'}

                  {!cargando && (
                    <>
                      {' '}
                      <Link to="/productos">
                        Explorar productos
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* INFORMACIÓN DEL PROCESO */}
      <p style={{
        marginTop: 20,
        fontSize: 13,
        color: '#738078'
      }}>
        Solo podrás aceptar o rechazar una
        cotización cuando DEC haya registrado
        el envío de la propuesta comercial.
        Tu respuesta quedará guardada y no
        podrá cambiarse desde esta pantalla.
        La aceptación no constituye por sí sola
        la confirmación definitiva del pedido.
      </p>

      {demo && (
        <small>
          Los botones de aceptación y rechazo
          están deshabilitados en la demostración.
        </small>
      )}

    </main>
  );
}

import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import { Link } from 'react-router-dom';

import {
  MessageCircle,
  X,
  Send,
  RefreshCw
} from 'lucide-react';

import { useAuth } from '../Hooks/useAuth';
import { supabase } from '../Services/supabase';

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const fechaHora = (fecha) =>
  new Date(fecha).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota'
  });

// ==========================================
// CHAT DEC
// ==========================================

export default function ChatDEC() {
  const {
    usuario,
    esAdmin,
    cargando: cargandoSesion
  } = useAuth();

  const [abierto, setAbierto] = useState(false);

  const [clientes, setClientes] = useState([]);

  const [clienteElegido, setClienteElegido] =
    useState('');

  const [mensajes, setMensajes] = useState([]);

  const [texto, setTexto] = useState('');

  const [cargandoMensajes, setCargandoMensajes] =
    useState(false);

  const [enviando, setEnviando] =
    useState(false);

  const [error, setError] = useState('');

  const finalRef = useRef(null);

  // El administrador selecciona la conversación.
  // El cliente solo puede utilizar su propio ID.

  const clienteActivo = esAdmin
    ? clienteElegido
    : usuario?.id;

  // ==========================================
  // LISTAR CLIENTES CON CONVERSACIONES
  // ==========================================

  const cargarClientes = useCallback(async () => {
    if (
      !supabase ||
      !usuario?.id ||
      !esAdmin
    ) {
      return;
    }

    const {
      data,
      error: errorConsulta
    } = await supabase.rpc(
      'listar_conversaciones_dec'
    );

    if (errorConsulta) {
      setError(errorConsulta.message);
      return;
    }

    const lista = data || [];

    setClientes(lista);

    setClienteElegido((anterior) =>
      anterior &&
      lista.some(
        (c) => c.client_id === anterior
      )
        ? anterior
        : (lista[0]?.client_id || '')
    );
  }, [usuario?.id, esAdmin]);

  // ==========================================
  // CONSULTAR MENSAJES
  // ==========================================

  const cargarMensajes = useCallback(async () => {
    if (!supabase || !clienteActivo) {
      setMensajes([]);
      return;
    }

    setCargandoMensajes(true);

    const {
      data,
      error: errorConsulta
    } = await supabase
      .from('dec_chat_messages')
      .select(`
        id,
        client_id,
        sender_id,
        body,
        created_at
      `)
      .eq('client_id', clienteActivo)
      .order('created_at', {
        ascending: false
      })
      .limit(100);

    if (errorConsulta) {
      setError(errorConsulta.message);
    } else {
      setMensajes((data || []).reverse());
    }

    setCargandoMensajes(false);
  }, [clienteActivo]);

  // ==========================================
  // CARGAR CONVERSACIONES AL ABRIR
  // ==========================================

  useEffect(() => {
    if (
      !abierto ||
      !usuario?.id ||
      !esAdmin
    ) {
      return;
    }

    cargarClientes();
  }, [
    abierto,
    usuario?.id,
    esAdmin,
    cargarClientes
  ]);

  useEffect(() => {
    if (!abierto || !usuario?.id) {
      return;
    }

    cargarMensajes();
  }, [
    abierto,
    usuario?.id,
    cargarMensajes
  ]);

  // ==========================================
  // RECIBIR MENSAJES EN TIEMPO REAL
  // ==========================================

  useEffect(() => {
    if (
      !abierto ||
      !usuario?.id ||
      !supabase
    ) {
      return;
    }

    const canal = supabase
      .channel(
        `dec-chat-${usuario.id}-${clienteActivo || 'lista'}`
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dec_chat_messages',

          ...(esAdmin
            ? {}
            : {
                filter:
                  `client_id=eq.${usuario.id}`
              })
        },

        (evento) => {
          // El administrador actualiza su
          // listado cuando un cliente escribe.
          if (esAdmin) {
            cargarClientes();
          }

          // Recargar únicamente la conversación
          // que está abierta.
          if (
            evento.new?.client_id ===
            clienteActivo
          ) {
            cargarMensajes();
          }
        }
      )
      .subscribe((estado) => {
        if (estado === 'CHANNEL_ERROR') {
          setError(
            'Se interrumpió la conexión en tiempo real.'
          );
        }
      });

    // Cerrar suscripción al salir.
    return () => {
      supabase.removeChannel(canal);
    };
  }, [
    abierto,
    usuario?.id,
    esAdmin,
    clienteActivo,
    cargarClientes,
    cargarMensajes
  ]);

  // ==========================================
  // MOSTRAR LOS MENSAJES MÁS RECIENTES
  // ==========================================

  useEffect(() => {
    if (abierto) {
      finalRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [abierto, mensajes]);

  // ==========================================
  // ENVIAR MENSAJE
  // ==========================================

  const enviar = async (evento) => {
    evento.preventDefault();

    const contenido = texto.trim();

    if (
      !supabase ||
      !usuario?.id ||
      !clienteActivo ||
      !contenido ||
      enviando
    ) {
      return;
    }

    setEnviando(true);
    setError('');

    const {
      error: errorEnvio
    } = await supabase
      .from('dec_chat_messages')
      .insert({
        client_id: clienteActivo,
        sender_id: usuario.id,
        body: contenido
      });

    if (errorEnvio) {
      setError(errorEnvio.message);
    } else {
      setTexto('');

      await cargarMensajes();

      if (esAdmin) {
        await cargarClientes();
      }
    }

    setEnviando(false);
  };

  // ==========================================
  // ESTILOS DEL CHAT
  // ==========================================

  const colorPrincipal = '#168b34';

  const estiloBoton = {
    border: 0,
    background: colorPrincipal,
    color: '#fff',
    cursor: 'pointer',
    borderRadius: 999,
    padding: '12px 18px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 700,
    boxShadow: '0 7px 22px #0002'
  };

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        zIndex: 1100
      }}
    >

      {/* VENTANA DEL CHAT */}
      {abierto && (
        <section
          aria-label="Chat de Distribuidor Eléctrico de Cali"
          style={{
            width: 385,
            maxWidth: 'calc(100vw - 36px)',
            height: 510,
            maxHeight: 'calc(100vh - 105px)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 15,
            border: '1px solid #dce7df',
            boxShadow: '0 12px 42px #0003',
            marginBottom: 12,
            overflow: 'hidden'
          }}
        >

          {/* ENCABEZADO */}
          <header
            style={{
              background: colorPrincipal,
              color: '#fff',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <strong>
              {esAdmin
                ? 'Mensajes de clientes'
                : 'Habla con DEC'}
            </strong>

            <button
              type="button"
              aria-label="Cerrar chat"
              onClick={() => setAbierto(false)}
              style={{
                background: 'transparent',
                color: 'white',
                border: 0,
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>
          </header>

          {/* VERIFICANDO SESIÓN */}
          {cargandoSesion ? (
            <p style={{ padding: 18 }}>
              Verificando tu sesión...
            </p>

          ) : !usuario ? (

            // USUARIO SIN SESIÓN
            <div style={{ padding: 20 }}>
              <p>
                Para escribirle al almacén
                debes iniciar sesión.
              </p>

              <Link
                to="/login"
                className="boton-verde"
                onClick={() => setAbierto(false)}
              >
                Iniciar sesión
              </Link>
            </div>

          ) : (

            <>
              {/* SELECCIONAR CLIENTE */}
              {esAdmin && (
                <div
                  style={{
                    padding: 10,
                    borderBottom:
                      '1px solid #e8eee9'
                  }}
                >
                  <label
                    htmlFor="dec-chat-cliente"
                    style={{
                      display: 'block',
                      fontSize: 12,
                      marginBottom: 5
                    }}
                  >
                    Conversación
                  </label>

                  <select
                    id="dec-chat-cliente"
                    value={clienteElegido}
                    onChange={(e) => {
                      setClienteElegido(
                        e.target.value
                      );

                      setError('');
                    }}
                    style={{
                      width: '100%',
                      padding: 9,
                      borderRadius: 7,
                      border:
                        '1px solid #dce7df'
                    }}
                  >
                    {clientes.length === 0 && (
                      <option value="">
                        Todavía no hay conversaciones
                      </option>
                    )}

                    {clientes.map((c) => (
                      <option
                        key={c.client_id}
                        value={c.client_id}
                      >
                        {c.email_cliente ||
                          `Cliente ${c.client_id.slice(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* MENSAJES */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  background: '#f7f9fc',
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9
                }}
              >

                {cargandoMensajes && (
                  <p style={{ fontSize: 12 }}>
                    Cargando mensajes...
                  </p>
                )}

                {!cargandoMensajes &&
                  mensajes.length === 0 && (
                    <p
                      style={{
                        fontSize: 13,
                        color: '#5c6b62',
                        textAlign: 'center'
                      }}
                    >
                      {clienteActivo
                        ? 'Aún no hay mensajes. ¡Escribe el primero!'
                        : 'Espera a que un cliente inicie una conversación.'}
                    </p>
                  )}

                {mensajes.map((m) => {
                  const propio =
                    m.sender_id === usuario.id;

                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: propio
                          ? 'flex-end'
                          : 'flex-start',

                        maxWidth: '85%',

                        background: propio
                          ? '#ddf5e2'
                          : '#fff',

                        border:
                          '1px solid #e2e9e4',

                        borderRadius: 11,
                        padding: '9px 11px',

                        overflowWrap: 'anywhere'
                      }}
                    >

                      <div
                        style={{
                          fontSize: 10,
                          color: '#607067',
                          marginBottom: 3
                        }}
                      >
                        {m.sender_id === m.client_id
                          ? 'Cliente'
                          : 'DEC'}
                      </div>

                      <div
                        style={{
                          whiteSpace: 'pre-wrap',
                          fontSize: 13
                        }}
                      >
                        {m.body}
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontSize: 10,
                          color: '#67766e',
                          marginTop: 4
                        }}
                      >
                        {fechaHora(
                          m.created_at
                        )}
                      </div>

                    </div>
                  );
                })}

                <div ref={finalRef} />
              </div>

              {/* ERRORES */}
              {error && (
                <p
                  role="alert"
                  style={{
                    padding: '6px 12px',
                    margin: 0,
                    color: '#b42318',
                    fontSize: 12
                  }}
                >
                  {error}
                </p>
              )}

              {/* ESCRIBIR Y ENVIAR */}
              {clienteActivo && (
                <form
                  onSubmit={enviar}
                  style={{
                    padding: 10,
                    display: 'flex',
                    alignItems: 'end',
                    gap: 7
                  }}
                >
                  <textarea
                    aria-label="Escribe tu mensaje"
                    value={texto}
                    onChange={(e) =>
                      setTexto(e.target.value)
                    }
                    placeholder="Escribe tu mensaje..."
                    maxLength={1000}
                    rows={2}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      resize: 'vertical',
                      padding: 9,
                      border:
                        '1px solid #dce7df',
                      borderRadius: 8
                    }}
                  />

                  <button
                    type="submit"
                    disabled={
                      enviando ||
                      !texto.trim()
                    }
                    aria-label="Enviar mensaje"
                    style={{
                      ...estiloBoton,
                      borderRadius: 8,
                      padding: 11,
                      opacity:
                        enviando ||
                        !texto.trim()
                          ? 0.5
                          : 1
                    }}
                  >
                    <Send size={17} />
                  </button>

                </form>
              )}

              {/* ACTUALIZAR MANUALMENTE */}
              <div
                style={{
                  textAlign: 'center',
                  paddingBottom: 7
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    cargarMensajes();

                    if (esAdmin) {
                      cargarClientes();
                    }
                  }}
                  style={{
                    border: 0,
                    color: colorPrincipal,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 11
                  }}
                >
                  <RefreshCw
                    size={12}
                    style={{
                      verticalAlign: 'middle'
                    }}
                  />
                  {' '}Actualizar
                </button>
              </div>

            </>
          )}

        </section>
      )}

      {/* BOTÓN FLOTANTE */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <button
          type="button"
          aria-label={
            abierto
              ? 'Cerrar chat de DEC'
              : 'Abrir chat de DEC'
          }
          onClick={() => {
            setAbierto(
              (anterior) => !anterior
            );

            setError('');
          }}
          style={estiloBoton}
        >
          {abierto
            ? <X size={19} />
            : <MessageCircle size={19} />}

          {abierto
            ? 'Cerrar chat'
            : 'Chat DEC'}
        </button>
      </div>

    </div>
  );
}
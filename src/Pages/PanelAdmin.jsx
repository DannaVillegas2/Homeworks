import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import {
  Clock3,
  CheckCircle2,
  Package,
  RefreshCw,
  Save,
  Pencil,
  Send,
  X,
  FileText,
  MailCheck
} from 'lucide-react';

import { jsPDF } from 'jspdf';

import { useAuth } from '../Hooks/useAuth';
import { useTienda } from '../Hooks/useTienda';
import { supabase } from '../Services/supabase';
import { formatoCOP } from '../data/productos';

// FUNCIONES AUXILIARES

const fechaBonita = (fecha) => {
  if (!fecha) return 'Sin fecha';

  const fechaReal = new Date(fecha);

  if (Number.isNaN(fechaReal.getTime())) {
    return 'Sin fecha';
  }

  return fechaReal.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Bogota'
  });
};

const dinero = (valor) =>
  valor == null
    ? 'Por confirmar'
    : formatoCOP(Number(valor));

const convertirItem = (item) => ({
  ...item,

  precioNuevo:
    item.unit_price_cop == null
      ? ''
      : String(item.unit_price_cop),

  descuentoNuevo:
    String(item.discount_percent ?? 0)
});

const calcularLinea = (item) => {
  const textoPrecio = String(
    item.precioNuevo ?? ''
  ).trim();

  const textoDescuento = String(
    item.descuentoNuevo ?? ''
  ).trim();

  if (!textoPrecio || !textoDescuento) {
    return null;
  }

  const precio = Number(textoPrecio);
  const descuento = Number(textoDescuento);
  const cantidad = Number(item.quantity);

  if (
    !Number.isSafeInteger(precio) ||
    precio < 0 ||
    precio > 1000000000 ||
    !Number.isInteger(descuento) ||
    descuento < 0 ||
    descuento > 100 ||
    !Number.isSafeInteger(cantidad) ||
    cantidad < 1
  ) {
    return null;
  }

  return Math.round(
    cantidad * precio * (100 - descuento) / 100
  );
};

// GENERAR PDF DE LA COTIZACIÓN

const descargarPdfCotizacion = (
  cotizacion,
  productos
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margen = 17;
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();

  const anchoTexto = ancho - 2 * margen;

  let y = 22;

  // Evitar que el contenido salga de la página.
  const nuevaPaginaSiHaceFalta = (
    altoNecesario = 12
  ) => {
    if (y + altoNecesario > alto - 22) {
      doc.addPage();
      y = 22;
    }
  };

  // Escribir párrafos y controlar saltos.
  const parrafo = (
    texto,
    tamano = 10,
    negrita = false
  ) => {
    doc.setFont(
      'helvetica',
      negrita ? 'bold' : 'normal'
    );

    doc.setFontSize(tamano);

    const lineas = doc.splitTextToSize(
      String(texto),
      anchoTexto
    );

    const paso = tamano <= 10 ? 5 : 6;

    nuevaPaginaSiHaceFalta(
      lineas.length * paso + 4
    );

    doc.text(lineas, margen, y);

    y += lineas.length * paso + 4;
  };

  // ENCABEZADO VERDE DE DEC

  doc.setFillColor(22, 139, 52);
  doc.rect(0, 0, ancho, 37, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);

  doc.text('DEC S.A.S.', margen, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text(
    'Distribuidor Eléctrico de Cali S.A.S.',
    margen,
    27
  );

  // DATOS GENERALES

  doc.setTextColor(32, 49, 39);

  y = 48;

  parrafo(
    'COTIZACIÓN COMERCIAL REVISADA',
    14,
    true
  );

  parrafo(
    `Cotización: ${cotizacion.id}`
  );

  parrafo(
    `Fecha de solicitud: ${fechaBonita(
      cotizacion.created_at
    )}`
  );

  parrafo(
    `Estado comercial: ${cotizacion.status}`
  );

  y += 3;

  // PRODUCTOS DE LA COTIZACIÓN

  productos.forEach((p, indice) => {
    nuevaPaginaSiHaceFalta(30);

    parrafo(
      `${indice + 1}. ${p.product_name}`,
      11,
      true
    );

    parrafo(
      `Cantidad: ${p.quantity}   |   Precio unitario: ${dinero(
        p.unit_price_cop
      )}`
    );

    parrafo(
      `Descuento: ${Number(
        p.discount_percent ?? 0
      )}%   |   Total: ${dinero(
        p.line_total_cop
      )}`
    );

    y += 3;

    nuevaPaginaSiHaceFalta(4);

    doc.setDrawColor(220, 231, 223);

    doc.line(
      margen,
      y,
      ancho - margen,
      y
    );

    y += 8;
  });

  // TOTAL REVISADO

  nuevaPaginaSiHaceFalta(20);

  doc.setTextColor(22, 139, 52);

  parrafo(
    `TOTAL REVISADO: ${dinero(
      cotizacion.total_known_cop
    )}`,
    14,
    true
  );

  doc.setTextColor(32, 49, 39);

  // OBSERVACIONES COMERCIALES

  if (cotizacion.review_message) {
    parrafo(
      'OBSERVACIONES DE DEC',
      11,
      true
    );

    parrafo(
      cotizacion.review_message
    );
  }

  parrafo(
    'Esta propuesta está sujeta a disponibilidad y confirmación comercial de DEC.',
    9
  );

  parrafo(
    'Contacto: distribuidorelectricodecali@hotmail.com',
    9
  );

  // NUMERACIÓN DE PÁGINAS

  const numeroPaginas =
    doc.internal.getNumberOfPages();

  for (
    let pagina = 1;
    pagina <= numeroPaginas;
    pagina++
  ) {
    doc.setPage(pagina);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(115, 128, 120);

    doc.text(
      `Página ${pagina} de ${numeroPaginas}`,
      ancho - margen,
      alto - 10,
      { align: 'right' }
    );
  }

  // DESCARGAR PDF

  const archivo =
    `DEC-Cotizacion-${cotizacion.id.slice(0, 8)}.pdf`;

  doc.save(archivo);

  return archivo;
};

// PANEL ADMINISTRATIVO DEC

export default function PanelAdmin({
  demo = false
}) {
  const navegar = useNavigate();

  const {
    usuario,
    esAdmin
  } = useAuth();

  const {
    cotizaciones
  } = useTienda();

  // ESTADOS GENERALES

  const [registros, setRegistros] =
    useState([]);

  const [
    productosActivos,
    setProductosActivos
  ] = useState(null);

  const [
    seleccionada,
    setSeleccionada
  ] = useState(null);

  const [detalle, setDetalle] =
    useState([]);

  const [
    mensajeRevision,
    setMensajeRevision
  ] = useState('');

  const [
    nuevoEstado,
    setNuevoEstado
  ] = useState('pendiente');

  const [cargando, setCargando] =
    useState(true);

  const [
    cargandoDetalle,
    setCargandoDetalle
  ] = useState(false);

  const [
    guardandoRevision,
    setGuardandoRevision
  ] = useState(false);

  const [
    guardandoEstado,
    setGuardandoEstado
  ] = useState(false);

  const [
    preparandoCorreo,
    setPreparandoCorreo
  ] = useState(null);

  const [
    confirmandoEnvio,
    setConfirmandoEnvio
  ] = useState(null);

  const [error, setError] =
    useState('');

  const [mensaje, setMensaje] =
    useState('');

  const detalleRef = useRef(null);

  // CARGAR COTIZACIONES DE SUPABASE

  const cargarDatos = useCallback(async () => {
    if (demo) {
      setCargando(false);
      return;
    }

    if (!supabase || !usuario || !esAdmin) {
      setError(
        'Necesitas iniciar sesión como administrador.'
      );

      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const {
        data,
        error: errorCotizaciones
      } = await supabase
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
          reviewed_at,
          sent_at
        `)
        .order('created_at', {
          ascending: false
        });

      if (errorCotizaciones) {
        throw errorCotizaciones;
      }

      const {
        count,
        error: errorProductos
      } = await supabase
        .from('products')
        .select('id', {
          count: 'exact',
          head: true
        })
        .eq('active', true);

      if (errorProductos) {
        throw errorProductos;
      }

      setRegistros(data || []);
      setProductosActivos(count ?? 0);

    } catch (err) {
      setError(
        err.message ||
        'No se pudieron cargar las cotizaciones.'
      );

    } finally {
      setCargando(false);
    }
  }, [
    demo,
    esAdmin,
    usuario
  ]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // LISTADO REAL O DE DEMOSTRACIÓN

  const lista = demo
    ? cotizaciones.map((c) => ({
        id: c.id,

        status:
          (c.estado || 'pendiente').toLowerCase(),

        created_at: c.fecha,

        review_status: 'sin_revisar',

        total_known_cop:
          (c.items || []).reduce(
            (s, p) =>
              s +
              (Number(p.precio) || 0) *
              Number(p.cantidad || 0),
            0
          )
      }))
    : registros;

  const pendientes = lista.filter(
    (c) => c.status === 'pendiente'
  ).length;

  const confirmadas = lista.filter(
    (c) => c.status === 'confirmada'
  ).length;

  // ABRIR REVISIÓN DE COTIZACIÓN

  const revisarCotizacion = async (
    cotizacion
  ) => {
    if (
      cargandoDetalle ||
      guardandoRevision ||
      guardandoEstado
    ) {
      return;
    }

    setSeleccionada(cotizacion);
    setDetalle([]);

    setError('');
    setMensaje('');

    setNuevoEstado(
      cotizacion.status || 'pendiente'
    );

    setMensajeRevision(
      cotizacion.review_message || ''
    );

    // VISTA DEMO
    if (demo) {
      const local = cotizaciones.find(
        (c) => c.id === cotizacion.id
      );

      setDetalle(
        (local?.items || []).map(
          (p, i) =>
            convertirItem({
              id: i + 1,
              product_name: p.nombre,
              quantity: p.cantidad,
              unit_price_cop: p.precio,
              discount_percent: 0,
              original_unit_price_cop:
                p.precio
            })
        )
      );

      return;
    }

    setCargandoDetalle(true);

    try {
      const {
        data,
        error: errorDetalle
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
        .eq('quote_id', cotizacion.id)
        .order('id', {
          ascending: true
        });

      if (errorDetalle) {
        throw errorDetalle;
      }

      setDetalle(
        (data || []).map(convertirItem)
      );

    } catch (err) {
      setError(
        err.message ||
        'No se pudieron consultar los productos.'
      );

    } finally {
      setCargandoDetalle(false);
    }
  };

  // DESPLAZARSE AL DETALLE

  useEffect(() => {
    if (
      seleccionada &&
      detalleRef.current
    ) {
      detalleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [seleccionada?.id]);

  // CERRAR DETALLE

  const cerrarDetalle = () => {
    if (
      guardandoRevision ||
      guardandoEstado ||
      cargandoDetalle
    ) {
      return;
    }

    setSeleccionada(null);
    setDetalle([]);
    setMensajeRevision('');
    setNuevoEstado('pendiente');
    setError('');
  };

  // EDITAR PRECIOS Y DESCUENTOS

  const actualizarItem = (
    id,
    campo,
    valor
  ) => {
    setDetalle((actual) =>
      actual.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor
            }
          : item
      )
    );
  };

  const totalRevisado = detalle.length
    ? detalle.reduce(
        (total, item) => {
          const subtotal =
            calcularLinea(item);

          if (
            total === null ||
            subtotal === null
          ) {
            return null;
          }

          return total + subtotal;
        },
        0
      )
    : null;

  // GUARDAR REVISIÓN

  const guardarRevision = async () => {
    if (
      demo ||
      !esAdmin ||
      !seleccionada ||
      guardandoRevision ||
      cargandoDetalle
    ) {
      return;
    }

    if (
      seleccionada.status !== 'pendiente' ||
      seleccionada.review_status === 'enviada'
    ) {
      setError(
        'Solo puedes revisar cotizaciones pendientes y no enviadas.'
      );

      return;
    }

    if (
      !detalle.length ||
      totalRevisado === null
    ) {
      setError(
        'Verifica todos los precios y descuentos.'
      );

      return;
    }

    if (mensajeRevision.length > 1000) {
      setError(
        'La observación no puede superar 1000 caracteres.'
      );

      return;
    }

    setGuardandoRevision(true);
    setError('');
    setMensaje('');

    try {
      const {
        data,
        error: errorRevision
      } = await supabase.rpc(
        'revisar_cotizacion_dec',
        {
          p_quote_id: seleccionada.id,

          p_items: detalle.map(
            (item) => ({
              id: item.id,

              precio_unitario: Number(
                item.precioNuevo
              ),

              descuento_porcentaje: Number(
                item.descuentoNuevo
              )
            })
          ),

          p_mensaje:
            mensajeRevision.trim() || null
        }
      );

      if (errorRevision) {
        throw errorRevision;
      }

      const cambios = {
        total_known_cop: data.total_cop,
        review_status: data.review_status,

        review_message:
          mensajeRevision.trim() || null
      };

      setRegistros((actual) =>
        actual.map((c) =>
          c.id === seleccionada.id
            ? {
                ...c,
                ...cambios
              }
            : c
        )
      );

      // CERRAR LA TABLA
      setSeleccionada(null);
      setDetalle([]);
      setMensajeRevision('');
      setNuevoEstado('pendiente');

      // CONSERVAR TU PREFERENCIA:
      // DESPUÉS DE GUARDAR, IR A
      // GESTIONAR PRODUCTOS.
      navegar('/admin/productos');

    } catch (err) {
      // NO CERRAR EN CASO DE ERROR.
      setError(
        err.message ||
        'No se pudo guardar la revisión.'
      );

    } finally {
      setGuardandoRevision(false);
    }
  };

  // CAMBIAR ESTADO COMERCIAL

  const guardarEstado = async () => {
    if (
      demo ||
      !esAdmin ||
      !seleccionada ||
      guardandoEstado
    ) {
      return;
    }

    if (
      nuevoEstado === seleccionada.status
    ) {
      setMensaje(
        'La cotización ya tiene ese estado.'
      );
      return;
    }

    if (
      nuevoEstado === 'confirmada' &&
      !window.confirm(
        '¿Verificaste precios, disponibilidad y aceptación del cliente?'
      )
    ) {
      return;
    }

    setGuardandoEstado(true);
    setError('');
    setMensaje('');

    try {
      const {
        data,
        error: errorEstado
      } = await supabase
        .from('quotes')
        .update({
          status: nuevoEstado
        })
        .eq('id', seleccionada.id)
        .select('id,status')
        .single();

      if (errorEstado) {
        throw errorEstado;
      }

      setRegistros((actual) =>
        actual.map((c) =>
          c.id === data.id
            ? {
                ...c,
                status: data.status
              }
            : c
        )
      );

      setSeleccionada((actual) => ({
        ...actual,
        status: data.status
      }));

      setMensaje(
        'Estado actualizado correctamente.'
      );

    } catch (err) {
      setError(
        err.message ||
        'No se pudo actualizar el estado.'
      );

    } finally {
      setGuardandoEstado(false);
    }
  };

  // PREPARAR CORREO Y GENERAR PDF

  const prepararCorreoYPdf = async (
    cotizacion
  ) => {
    if (
      demo ||
      !supabase ||
      !esAdmin ||
      preparandoCorreo ||
      confirmandoEnvio
    ) {
      return;
    }

    if (
      cotizacion.status !== 'pendiente' ||
      cotizacion.review_status !==
        'lista_para_enviar' ||
      cotizacion.sent_at
    ) {
      setError(
        'Primero debes guardar la revisión comercial.'
      );

      return;
    }

    // ABRIR LA PESTAÑA DURANTE EL CLIC
    // PARA EVITAR BLOQUEADORES.
    const ventana = window.open(
      'about:blank',
      '_blank'
    );

    if (!ventana) {
      setError(
        'Permite las ventanas emergentes para abrir Outlook.'
      );

      return;
    }

    setPreparandoCorreo(cotizacion.id);
    setError('');
    setMensaje('');

    try {
      // OBTENER DATOS ACTUALIZADOS
      // DIRECTAMENTE DE SUPABASE.
      const [
        resultadoEmail,
        resultadoCotizacion,
        resultadoItems
      ] = await Promise.all([
        supabase.rpc(
          'obtener_email_cliente_cotizacion_dec',
          {
            p_quote_id: cotizacion.id
          }
        ),

        supabase
          .from('quotes')
          .select(`
            id,
            status,
            created_at,
            total_known_cop,
            review_status,
            review_message,
            sent_at
          `)
          .eq('id', cotizacion.id)
          .single(),

        supabase
          .from('quote_items')
          .select(`
            product_name,
            quantity,
            unit_price_cop,
            discount_percent,
            line_total_cop
          `)
          .eq('quote_id', cotizacion.id)
      ]);

      if (resultadoEmail.error) {
        throw resultadoEmail.error;
      }

      if (resultadoCotizacion.error) {
        throw resultadoCotizacion.error;
      }

      if (resultadoItems.error) {
        throw resultadoItems.error;
      }

      const correoCliente =
        resultadoEmail.data;

      const actual =
        resultadoCotizacion.data;

      const productos =
        resultadoItems.data || [];

      if (
        typeof correoCliente !== 'string' ||
        !correoCliente.includes('@')
      ) {
        throw new Error(
          'El cliente no tiene un correo válido.'
        );
      }

      if (
        actual.status !== 'pendiente' ||
        actual.review_status !==
          'lista_para_enviar' ||
        actual.sent_at
      ) {
        throw new Error(
          'La cotización ya no está disponible para enviar. Actualiza el panel.'
        );
      }

      if (
        !productos.length ||
        productos.some(
          (p) =>
            p.unit_price_cop == null ||
            p.line_total_cop == null
        )
      ) {
        throw new Error(
          'La cotización contiene productos sin precio confirmado.'
        );
      }

      // COMPROBAR QUE LOS TOTALES
      // COINCIDAN ANTES DE GENERAR EL PDF.
      const totalItems = productos.reduce(
        (s, p) =>
          s + Number(p.line_total_cop),
        0
      );

      if (
        totalItems !==
        Number(actual.total_known_cop)
      ) {
        throw new Error(
          'El total de la cotización no coincide con sus productos.'
        );
      }

      // DESCARGAR PDF

      const archivo =
        descargarPdfCotizacion(
          actual,
          productos
        );

      // CONSTRUIR CORREO

      const asunto =
        `DEC - Cotización revisada ${actual.id.slice(0, 8)}`;

      const cuerpo = [
        'Cordial saludo,',
        '',
        'Desde Distribuidor Eléctrico de Cali S.A.S. compartimos nuestra propuesta comercial revisada.',
        '',
        `Cotización: ${actual.id}`,
        `Total revisado: ${dinero(
          actual.total_known_cop
        )}`,
        '',
        actual.review_message
          ? `Observaciones: ${actual.review_message}`
          : 'Los precios están sujetos a disponibilidad y confirmación comercial de DEC.',
        '',
        `Adjuntamos el documento ${archivo} con el detalle de productos y descuentos.`,
        '',
        'Gracias por confiar en Distribuidor Eléctrico de Cali S.A.S.',
        '',
        'Atentamente,',
        'Distribuidor Eléctrico de Cali S.A.S.',
        'distribuidorelectricodecali@hotmail.com'
      ].join('\n');

      // CORREGIR EL PROBLEMA DE LOS "+"

      // No usar URLSearchParams para el cuerpo:
      // puede convertir espacios en +.
      const urlOutlook =
        'https://outlook.live.com/mail/0/deeplink/compose' +
        `?to=${encodeURIComponent(
          correoCliente
        )}` +
        `&subject=${encodeURIComponent(
          asunto
        )}` +
        `&body=${encodeURIComponent(
          cuerpo
        )}`;

      // ABRIR OUTLOOK CON EL CORREO LISTO.
      ventana.location.replace(urlOutlook);

      setMensaje(
        `Se descargó ${archivo} y se abrió Outlook. ` +
        'Adjunta el PDF descargado, verifica que estás en el Hotmail de DEC y presiona Enviar. ' +
        'Después confirma el envío en este panel.'
      );

    } catch (err) {
      if (!ventana.closed) {
        ventana.close();
      }

      setError(
        err.message ||
        'No se pudo preparar el correo y el PDF.'
      );

    } finally {
      setPreparandoCorreo(null);
    }
  };

  // CONFIRMAR ENVÍO REALIZADO EN OUTLOOK

  const confirmarEnvioOutlook = async (
    cotizacion
  ) => {
    if (
      demo ||
      !supabase ||
      !esAdmin ||
      confirmandoEnvio ||
      preparandoCorreo
    ) {
      return;
    }

    const confirmado = window.confirm(
      '¿Ya ENVIASTE el correo desde el Hotmail de DEC con el PDF adjunto? Solo confirma después de comprobarlo en Outlook.'
    );

    if (!confirmado) {
      return;
    }

    setConfirmandoEnvio(cotizacion.id);
    setError('');
    setMensaje('');

    try {
      const {
        data,
        error: errorConfirmacion
      } = await supabase.rpc(
        'marcar_cotizacion_enviada_manualmente_dec',
        {
          p_quote_id: cotizacion.id
        }
      );

      if (errorConfirmacion) {
        throw errorConfirmacion;
      }

      const cambios = {
        review_status: 'enviada',
        sent_at: data.sent_at
      };

      setRegistros((actual) =>
        actual.map((c) =>
          c.id === cotizacion.id
            ? {
                ...c,
                ...cambios
              }
            : c
        )
      );

      setSeleccionada((actual) =>
        actual?.id === cotizacion.id
          ? {
              ...actual,
              ...cambios
            }
          : actual
      );

      setMensaje(
        'Envío manual registrado correctamente en DEC.'
      );

    } catch (err) {
      setError(
        err.message ||
        'No se pudo registrar el envío.'
      );

    } finally {
      setConfirmandoEnvio(null);
    }
  };

  // INTERFAZ PRINCIPAL

  return (
    <main className="pagina-contenido admin-pagina">

      {/* ENCABEZADO */}
      <div className="admin-encabezado">
        <div>
          <h1>Panel administrativo</h1>

          <p className="subtitulo">
            Revisa cotizaciones, ajusta precios
            y aplica descuentos en DEC.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          {!demo && (
            <Link
              to="/admin/productos"
              className="boton-verde"
            >
              <Package size={18} />
              Gestionar productos
            </Link>
          )}

          <button
            type="button"
            className="boton-secundario"
            onClick={cargarDatos}
            disabled={cargando || demo}
          >
            <RefreshCw size={17} />
            Actualizar datos
          </button>
        </div>
      </div>

      {demo && (
        <p className="banner-demo">
          Vista de demostración con datos locales.
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color: '#b42318',
            fontWeight: 600
          }}
        >
          {error}
        </p>
      )}

      {mensaje && (
        <p
          role="status"
          style={{
            color: '#168b34',
            fontWeight: 600
          }}
        >
          {mensaje}
        </p>
      )}

      {/* INDICADORES */}

      <div className="admin-indicadores">
        <div className="indicador indicador-pendiente">
          <Clock3 size={22} />

          <span>
            Cotizaciones pendientes
          </span>

          <strong>{pendientes}</strong>
        </div>

        <div className="indicador">
          <CheckCircle2 size={22} />

          <span>
            Cotizaciones confirmadas
          </span>

          <strong>{confirmadas}</strong>
        </div>

        <div className="indicador">
          <Package size={22} />

          <span>
            Productos activos
          </span>

          <strong>
            {demo
              ? '—'
              : productosActivos ?? '—'}
          </strong>
        </div>
      </div>

      {/* LISTADO DE COTIZACIONES */}

      <h2 className="admin-subtitulo">
        Cotizaciones recientes
      </h2>

      {cargando && !demo && (
        <p>Cargando cotizaciones...</p>
      )}

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>N.º cotización</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Revisión</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lista.length ? (
              lista.map((c) => {
                const revisada =
                  c.status === 'pendiente' &&
                  c.review_status ===
                    'lista_para_enviar' &&
                  !c.sent_at;

                const enviada =
                  c.review_status === 'enviada' ||
                  Boolean(c.sent_at);

                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>

                    <td>
                      {fechaBonita(c.created_at)}
                    </td>

                    <td>{c.status}</td>

                    <td>
                      {enviada
                        ? 'Enviada'
                        : revisada
                          ? 'Revisada'
                          : 'Sin revisar'}
                    </td>

                    <td>
                      <div style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>

                        {/* REVISAR */}
                        <button
                          type="button"
                          className="boton-enlace"
                          onClick={() =>
                            revisarCotizacion(c)
                          }
                          disabled={
                            cargandoDetalle ||
                            guardandoRevision ||
                            guardandoEstado
                          }
                        >
                          <Pencil size={15} />
                          Revisar
                        </button>

                        {/* VER PDF */}
                        <Link
                          className="boton-enlace"
                          target="_blank"
                          rel="noopener noreferrer"
                          to={
                            `/cotizacion/${c.id}/imprimir`
                          }
                        >
                          <FileText size={15} />
                          Ver PDF
                        </Link>

                        {/* PREPARAR CORREO Y PDF */}
                        {!demo && revisada && (
                          <>
                            <button
                              type="button"
                              className="boton-enlace"
                              style={{
                                color: '#168b34'
                              }}
                              onClick={() =>
                                prepararCorreoYPdf(c)
                              }
                              disabled={
                                !!preparandoCorreo ||
                                !!confirmandoEnvio
                              }
                            >
                              <Send size={15} />

                              {preparandoCorreo === c.id
                                ? 'Preparando...'
                                : 'Preparar correo y PDF'}
                            </button>

                            {/* CONFIRMAR ENVÍO */}
                            <button
                              type="button"
                              className="boton-secundario"
                              onClick={() =>
                                confirmarEnvioOutlook(c)
                              }
                              disabled={
                                !!preparandoCorreo ||
                                !!confirmandoEnvio
                              }
                            >
                              <MailCheck size={15} />

                              {confirmandoEnvio === c.id
                                ? 'Registrando...'
                                : 'Confirmar envío'}
                            </button>
                          </>
                        )}

                        {/* ENVIADA */}
                        {!demo && enviada && (
                          <span style={{
                            color: '#168b34',
                            fontWeight: 600
                          }}>
                            <CheckCircle2 size={15} />
                            Envío registrado
                          </span>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="sin-registros"
                >
                  {cargando
                    ? 'Consultando cotizaciones...'
                    : 'No hay cotizaciones registradas.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!demo && (
        <p style={{
          color: '#738078',
          marginTop: 16,
          fontSize: 13
        }}>
          Preparar correo y PDF descarga el
          documento y abre Outlook.com.
          Debes adjuntar el archivo descargado
          y enviarlo desde el Hotmail oficial
          de DEC.
        </p>
      )}

      {/* DETALLE DE COTIZACIÓN */}

      {seleccionada && (
        <section
          ref={detalleRef}
          style={{
            marginTop: 38
          }}
        >

          {/* ENCABEZADO DEL DETALLE */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap'
          }}>
            <h2 className="admin-subtitulo">
              Revisar cotización
            </h2>

            <button
              type="button"
              className="boton-secundario"
              onClick={cerrarDetalle}
              disabled={
                cargandoDetalle ||
                guardandoRevision ||
                guardandoEstado
              }
            >
              <X size={17} />
              Cerrar detalle
            </button>
          </div>

          {/* INFORMACIÓN */}
          <p>
            <strong>N.º:</strong>{' '}
            {seleccionada.id}
          </p>

          <p>
            <strong>Fecha:</strong>{' '}
            {fechaBonita(
              seleccionada.created_at
            )}
          </p>

          <p>
            <strong>Estado:</strong>{' '}
            {seleccionada.status}
          </p>

          <p>
            <strong>Revisión:</strong>{' '}
            {seleccionada.review_status ===
            'enviada'
              ? 'Enviada'
              : seleccionada.review_status ===
                'lista_para_enviar'
                ? 'Lista para enviar'
                : 'Sin revisar'}
          </p>

          {seleccionada.customer_note && (
            <p>
              <strong>Nota del cliente:</strong>{' '}
              {seleccionada.customer_note}
            </p>
          )}

          <p style={{
            color: '#738078',
            marginTop: 18
          }}>
            Puedes ajustar precios y descuentos
            para esta cotización sin modificar
            el catálogo.
          </p>

          {/* TABLA EDITABLE */}
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio original</th>
                  <th>Precio nuevo</th>
                  <th>Descuento (%)</th>
                  <th>Total revisado</th>
                </tr>
              </thead>

              <tbody>
                {cargandoDetalle ? (
                  <tr>
                    <td colSpan="6">
                      Cargando productos...
                    </td>
                  </tr>
                ) : detalle.length ? (
                  detalle.map((item) => (
                    <tr key={item.id}>

                      <td>
                        {item.product_name}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        {dinero(
                          item.original_unit_price_cop ??
                          item.unit_price_cop
                        )}
                      </td>

                      {/* PRECIO NUEVO */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="1000000000"
                          step="1"
                          value={item.precioNuevo}
                          aria-label={
                            `Precio de ${item.product_name}`
                          }
                          onChange={(e) =>
                            actualizarItem(
                              item.id,
                              'precioNuevo',
                              e.target.value
                            )
                          }
                          disabled={
                            demo ||
                            guardandoRevision ||
                            seleccionada.status !==
                              'pendiente' ||
                            seleccionada.review_status ===
                              'enviada'
                          }
                          style={{
                            width: 135,
                            padding: 9,
                            border:
                              '1px solid #dce7df',
                            borderRadius: 7
                          }}
                        />
                      </td>

                      {/* DESCUENTO */}
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={item.descuentoNuevo}
                          aria-label={
                            `Descuento de ${item.product_name}`
                          }
                          onChange={(e) =>
                            actualizarItem(
                              item.id,
                              'descuentoNuevo',
                              e.target.value
                            )
                          }
                          disabled={
                            demo ||
                            guardandoRevision ||
                            seleccionada.status !==
                              'pendiente' ||
                            seleccionada.review_status ===
                              'enviada'
                          }
                          style={{
                            width: 85,
                            padding: 9,
                            border:
                              '1px solid #dce7df',
                            borderRadius: 7
                          }}
                        />
                      </td>

                      {/* TOTAL POR PRODUCTO */}
                      <td>
                        <strong>
                          {dinero(
                            calcularLinea(item)
                          )}
                        </strong>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24
          }}>
            <div style={{
              padding: 22,
              minWidth: 280,
              border:
                '1px solid #dce7df',
              borderRadius: 12,
              background: '#f4f7f5'
            }}>
              <p style={{
                marginTop: 0
              }}>
                Total revisado
              </p>

              <strong style={{
                fontSize: 28,
                color: '#168b34'
              }}>
                {dinero(totalRevisado)}
              </strong>
            </div>
          </div>

          {/* OBSERVACIONES */}
          <div style={{
            marginTop: 26,
            maxWidth: 700
          }}>
            <label
              htmlFor="mensaje-revision"
              style={{
                display: 'block',
                marginBottom: 10,
                fontWeight: 600
              }}
            >
              Observaciones para el cliente
            </label>

            <textarea
              id="mensaje-revision"
              rows={4}
              maxLength={1000}
              value={mensajeRevision}
              onChange={(e) =>
                setMensajeRevision(
                  e.target.value
                )
              }
              disabled={
                demo ||
                guardandoRevision ||
                seleccionada.status !==
                  'pendiente' ||
                seleccionada.review_status ===
                  'enviada'
              }
              placeholder="Ej. Se aplicó un descuento especial. Precios sujetos a disponibilidad."
              style={{
                width: '100%',
                padding: 13,
                border:
                  '1px solid #dce7df',
                borderRadius: 8
              }}
            />
          </div>

          {/* GUARDAR REVISIÓN */}
          {!demo && (
            <div style={{
              marginTop: 22,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                className="boton-verde"
                onClick={guardarRevision}
                disabled={
                  guardandoRevision ||
                  cargandoDetalle ||
                  !detalle.length ||
                  totalRevisado === null ||
                  seleccionada.status !==
                    'pendiente' ||
                  seleccionada.review_status ===
                    'enviada'
                }
              >
                <Save size={17} />

                {guardandoRevision
                  ? 'Guardando revisión...'
                  : 'Guardar revisión y descuentos'}
              </button>
            </div>
          )}

          <p style={{
            marginTop: 15,
            color: '#738078',
            fontSize: 13
          }}>
            Al guardar correctamente irás a
            Gestionar productos. Para preparar
            el correo, regresa al Panel
            administrativo y utiliza
            Preparar correo y PDF.
          </p>

          {/* CAMBIAR ESTADO */}
          {!demo && (
            <div style={{
              borderTop:
                '1px solid #dce7df',
              marginTop: 34,
              paddingTop: 24
            }}>
              <h3>
                Estado de la cotización
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
                marginTop: 16
              }}>
                <select
                  value={nuevoEstado}
                  onChange={(e) =>
                    setNuevoEstado(
                      e.target.value
                    )
                  }
                  disabled={guardandoEstado}
                  aria-label="Estado de la cotización"
                  style={{
                    padding: 11,
                    border:
                      '1px solid #dce7df',
                    borderRadius: 8
                  }}
                >
                  <option value="pendiente">
                    Pendiente
                  </option>

                  <option value="confirmada">
                    Confirmada
                  </option>
                </select>

                <button
                  type="button"
                  className="boton-secundario"
                  onClick={guardarEstado}
                  disabled={guardandoEstado}
                >
                  <Save size={16} />
                  Guardar estado
                </button>
              </div>

              <p style={{
                color: '#738078',
                fontSize: 13
              }}>
                Confirma una cotización solo
                después de comprobar los precios,
                la disponibilidad y la aceptación
                del cliente.
              </p>
            </div>
          )}
        </section>
      )}

    </main>
  );
}
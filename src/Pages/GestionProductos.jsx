import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import { Link } from 'react-router-dom';

import {
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  X,
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

import { supabase } from '../Services/supabase';
import { useAuth } from '../Hooks/useAuth';
import { formatoCOP } from '../data/productos';

const BUCKET = 'productos-dec';
const MAX_IMAGEN = 5 * 1024 * 1024;
const POR_PAGINA = 20;

const TIPOS_IMAGEN = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const categorias = [
  'Iluminación',
  'Cables y conductores',
  'Interruptores y tomacorrientes',
  'Tuberías y canalizaciones',
  'Protecciones eléctricas',
  'Tableros y cajas',
  'Accesorios eléctricos',
  'Herramientas',
  'Extractores'
];

const vacio = {
  nombre: '',
  categoria: 'Iluminación',
  marca: '',
  descripcion: '',
  imagen: '',
  precio: ''
};

const estiloInput = {
  display: 'block',
  width: '100%',
  padding: 12,
  border: '1px solid #dce7df',
  borderRadius: 8,
  fontSize: 15,
  background: '#fff',
  color: '#173624',
  marginTop: 8
};

export default function GestionProductos() {
  const { esAdmin } = useAuth();

  // LISTADO
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [recarga, setRecarga] = useState(0);

  // FILTROS
  const [busqueda, setBusqueda] = useState('');
  const [termino, setTermino] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [pagina, setPagina] = useState(1);

  // EDICIÓN
  const [modo, setModo] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState({ ...vacio });

  // IMÁGENES
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState('');
  const [claveArchivo, setClaveArchivo] = useState(0);

  // ACCIONES
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(null);

  // MENSAJES
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [progreso, setProgreso] = useState('');

  const solicitudActual = useRef(0);
  const referenciaFormulario = useRef(null);

  const actualizarListado = () => {
    setRecarga((n) => n + 1);
  };

  // BUSCADOR CON ESPERA DE 300 MS

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setTermino(busqueda.trim());
      setPagina(1);
    }, 300);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // CONSULTAR PRODUCTOS EN SUPABASE

  const cargarProductos = useCallback(async () => {
    if (!esAdmin || !supabase) {
      setCargando(false);
      return;
    }

    const solicitud = ++solicitudActual.current;
    setCargando(true);
    setError('');

    try {
      let consulta = supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          category,
          brand,
          description,
          image_url,
          price_cop,
          price_validated,
          active
        `, { count: 'exact' });

      if (termino) {
        const texto = termino.replace(
          /[%_\\]/g,
          '\\$&'
        );

        consulta = consulta.ilike(
          'name',
          `%${texto}%`
        );
      }

      if (categoriaFiltro) {
        consulta = consulta.eq(
          'category',
          categoriaFiltro
        );
      }

      // NUEVO: FILTRAR ACTIVOS U OCULTOS
      if (estadoFiltro === 'activos') {
        consulta = consulta.eq('active', true);
      }

      if (estadoFiltro === 'ocultos') {
        consulta = consulta.eq('active', false);
      }

      const inicio = (pagina - 1) * POR_PAGINA;

      const { data, count, error: errorConsulta } =
        await consulta
          .order('name', { ascending: true })
          .order('id', { ascending: true })
          .range(inicio, inicio + POR_PAGINA - 1);

      if (errorConsulta) throw errorConsulta;
      if (solicitud !== solicitudActual.current) return;

      const cantidad = count ?? 0;
      const maxPagina = Math.max(
        1,
        Math.ceil(cantidad / POR_PAGINA)
      );

      if (pagina > maxPagina) {
        setPagina(maxPagina);
        return;
      }

      setProductos(data || []);
      setTotal(cantidad);

    } catch (err) {
      if (solicitud !== solicitudActual.current) return;

      console.error('Error al consultar productos:', err);
      setError(
        err.message || 'No se pudieron cargar los productos.'
      );

    } finally {
      if (solicitud === solicitudActual.current) {
        setCargando(false);
      }
    }
  }, [
    esAdmin,
    termino,
    categoriaFiltro,
    estadoFiltro,
    pagina,
    recarga
  ]);

  useEffect(() => {
    cargarProductos();

    return () => {
      solicitudActual.current++;
    };
  }, [cargarProductos]);

  // VISTA PREVIA DE FOTOGRAFÍA

  useEffect(() => {
    if (!archivoImagen) {
      setVistaPrevia('');
      return;
    }

    const url = URL.createObjectURL(archivoImagen);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [archivoImagen]);

  // FILTROS

  const limpiarFiltros = () => {
    setBusqueda('');
    setTermino('');
    setCategoriaFiltro('');
    setEstadoFiltro('todos');
    setPagina(1);
  };

  // FORMULARIOS

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor
    }));
  };

  const abrirNuevo = () => {
    setModo('crear');
    setSeleccionado(null);
    setFormulario({ ...vacio });
    setArchivoImagen(null);
    setClaveArchivo((n) => n + 1);
    setError('');
    setMensaje('');
  };

  const abrirEdicion = (p) => {
    setModo('editar');
    setSeleccionado(p);

    setFormulario({
      nombre: p.name ?? '',
      categoria: p.category ?? 'Iluminación',
      marca: p.brand ?? '',
      descripcion: p.description ?? '',
      imagen: p.image_url ?? '',
      precio: p.price_cop == null
        ? ''
        : String(p.price_cop)
    });

    setArchivoImagen(null);
    setClaveArchivo((n) => n + 1);
    setError('');
    setMensaje('');
  };

  const cerrarFormulario = () => {
    if (guardando) return;

    setModo(null);
    setSeleccionado(null);
    setArchivoImagen(null);
    setError('');
    setProgreso('');
  };

  useEffect(() => {
    if (modo && referenciaFormulario.current) {
      referenciaFormulario.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [modo, seleccionado]);

  // SELECCIONAR IMAGEN

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setError('');

    if (!TIPOS_IMAGEN[archivo.type]) {
      setError('Utiliza una imagen JPG, PNG o WEBP.');
      e.target.value = '';
      return;
    }

    if (archivo.size > MAX_IMAGEN) {
      setError('La imagen no puede superar los 5 MB.');
      e.target.value = '';
      return;
    }

    setArchivoImagen(archivo);
  };

  const quitarImagen = () => {
    setArchivoImagen(null);
    setClaveArchivo((n) => n + 1);
  };

  // SUBIR IMAGEN A STORAGE

  const subirImagen = async (archivo) => {
    const extension = TIPOS_IMAGEN[archivo.type];

    if (!extension || archivo.size > MAX_IMAGEN) {
      throw new Error('Imagen no válida.');
    }

    const ruta = `productos/${crypto.randomUUID()}.${extension}`;

    const { error: errorSubida } =
      await supabase.storage
        .from(BUCKET)
        .upload(ruta, archivo, {
          contentType: archivo.type,
          cacheControl: '3600',
          upsert: false
        });

    if (errorSubida) throw errorSubida;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(ruta);

    if (!data?.publicUrl) {
      throw new Error('No se obtuvo la URL de la imagen.');
    }

    return data.publicUrl;
  };

  // CREAR O EDITAR PRODUCTO

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!esAdmin || !supabase || !modo || guardando) return;

    const nombre = formulario.nombre.trim();
    const categoria = formulario.categoria.trim();
    const precioTexto = formulario.precio.trim();

    const precio = precioTexto === ''
      ? null
      : Number(precioTexto);

    if (!nombre || !categoria) {
      setError('Nombre y categoría son obligatorios.');
      return;
    }

    if (
      precio !== null &&
      (!Number.isSafeInteger(precio) || precio < 0)
    ) {
      setError('Ingresa un precio válido en COP.');
      return;
    }

    const imagenManual = formulario.imagen.trim();

    if (
      !archivoImagen &&
      imagenManual &&
      !imagenManual.startsWith('/images/') &&
      !/^https:\/\//i.test(imagenManual)
    ) {
      setError(
        'Utiliza una URL HTTPS o una ruta /images/.'
      );
      return;
    }

    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      let imagenFinal = imagenManual || null;

      if (archivoImagen) {
        setProgreso('Subiendo fotografía...');
        imagenFinal = await subirImagen(archivoImagen);
      }

      setProgreso('Guardando información...');

      const datos = {
        name: nombre,
        category: categoria,
        brand: formulario.marca.trim() || null,
        description: formulario.descripcion.trim(),
        image_url: imagenFinal,
        price_cop: precio
      };

      if (modo === 'crear') {
        const uuid = crypto.randomUUID();

        const slug = nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 50);

        const { error: errorCrear } =
          await supabase
            .from('products')
            .insert({
              ...datos,
              id: `${slug || 'producto'}-${uuid.slice(0, 8)}`,
              sku: `DEC-${uuid}`,
              price_validated: false,
              active: true
            });

        if (errorCrear) throw errorCrear;
      }

      if (modo === 'editar') {
        if (!seleccionado) {
          throw new Error('Producto no seleccionado.');
        }

        const precioAnterior =
          seleccionado.price_cop == null
            ? null
            : Number(seleccionado.price_cop);

        const { error: errorEditar } =
          await supabase
            .from('products')
            .update({
              ...datos,
              ...(precio !== precioAnterior
                ? { price_validated: false }
                : {})
            })
            .eq('id', seleccionado.id)
            .select('id')
            .single();

        if (errorEditar) throw errorEditar;
      }

      const creado = modo === 'crear';

      setModo(null);
      setSeleccionado(null);
      setArchivoImagen(null);
      setFormulario({ ...vacio });

      if (creado) limpiarFiltros();
      actualizarListado();

      setMensaje(
        creado
          ? 'Producto registrado correctamente.'
          : 'Producto actualizado correctamente.'
      );

    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError(
        err.message || 'No se pudo guardar el producto.'
      );
    } finally {
      setGuardando(false);
      setProgreso('');
    }
  };

  // NUEVO: ACTIVAR / OCULTAR PRODUCTO

  const cambiarVisibilidad = async (producto) => {
    if (!esAdmin || !supabase || cambiandoEstado) return;

    const nuevoEstado = !producto.active;

    if (!nuevoEstado) {
      const confirmar = window.confirm(
        `¿Quieres ocultar "${producto.name}" del catálogo de DEC? El producto no será eliminado y podrás activarlo nuevamente.`
      );

      if (!confirmar) return;
    }

    setCambiandoEstado(producto.id);
    setError('');
    setMensaje('');

    try {
      const { data, error: errorActualizar } =
        await supabase
          .from('products')
          .update({
            active: nuevoEstado
          })
          .eq('id', producto.id)
          .select('id, active')
          .single();

      if (errorActualizar) throw errorActualizar;

      setProductos((actual) =>
        actual.map((p) =>
          p.id === data.id
            ? { ...p, active: data.active }
            : p
        )
      );

      setMensaje(
        data.active
          ? `"${producto.name}" está activo.`
          : `"${producto.name}" fue marcado como oculto.`
      );

      actualizarListado();

    } catch (err) {
      console.error('Error al cambiar estado:', err);

      setError(
        err.message ||
        'No se pudo cambiar la visibilidad.'
      );

    } finally {
      setCambiandoEstado(null);
    }
  };

  // PROTECCIÓN

  if (!esAdmin) {
    return (
      <main className="pagina-contenido">
        <h1>Acceso restringido</h1>
        <p>
          Esta sección es exclusiva para
          administradores de DEC.
        </p>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  const desde = total === 0
    ? 0
    : (pagina - 1) * POR_PAGINA + 1;

  const hasta = Math.min(pagina * POR_PAGINA, total);

  // INTERFAZ

  return (
    <main className="pagina-contenido admin-pagina">

      <Link to="/admin" className="volver-link">
        <ArrowLeft size={17} />
        Volver al panel administrativo
      </Link>

      <div className="admin-encabezado">
        <div>
          <h1>Gestionar productos</h1>
          <p className="subtitulo">
            Administra información, precios,
            imágenes y visibilidad del catálogo DEC.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            className="boton-verde"
            onClick={abrirNuevo}
            disabled={guardando}
          >
            <Plus size={18} />
            Agregar producto
          </button>

          <button
            type="button"
            className="boton-secundario"
            onClick={actualizarListado}
            disabled={cargando || guardando}
          >
            <RefreshCw size={17} />
            {' '}Actualizar listado
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" style={{
          color: '#b42318',
          fontWeight: 600
        }}>
          {error}
        </p>
      )}

      {mensaje && (
        <p role="status" style={{
          color: '#168b34',
          fontWeight: 600
        }}>
          {mensaje}
        </p>
      )}

      {/* FORMULARIO DE CREACIÓN Y EDICIÓN */}
      {modo && (
        <section
          ref={referenciaFormulario}
          style={{
            marginTop: 30,
            maxWidth: 740,
            padding: 26,
            background: '#fff',
            border: '1px solid #dce7df',
            borderRadius: 12
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <h2>
              {modo === 'crear'
                ? 'Agregar nuevo producto'
                : 'Editar producto'}
            </h2>

            <button
              type="button"
              className="boton-secundario"
              onClick={cerrarFormulario}
              disabled={guardando}
              aria-label="Cerrar formulario"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={guardarProducto}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18
            }}
          >
            <label>
              Nombre del producto *
              <input
                type="text"
                required
                maxLength={150}
                value={formulario.nombre}
                onChange={(e) =>
                  actualizarCampo('nombre', e.target.value)
                }
                style={estiloInput}
              />
            </label>

            <label>
              Categoría *
              <select
                required
                value={formulario.categoria}
                onChange={(e) =>
                  actualizarCampo('categoria', e.target.value)
                }
                style={estiloInput}
              >
                {!categorias.includes(formulario.categoria) &&
                  formulario.categoria && (
                    <option value={formulario.categoria}>
                      {formulario.categoria}
                    </option>
                  )}

                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Marca
              <input
                type="text"
                maxLength={100}
                value={formulario.marca}
                onChange={(e) =>
                  actualizarCampo('marca', e.target.value)
                }
                style={estiloInput}
              />
            </label>

            <label>
              Precio de referencia (COP)
              <input
                type="number"
                min="0"
                step="1"
                value={formulario.precio}
                onChange={(e) =>
                  actualizarCampo('precio', e.target.value)
                }
                style={estiloInput}
              />
            </label>

            <small>
              Deja el precio vacío si todavía
              está pendiente de confirmar.
            </small>

            <label>
              Descripción
              <textarea
                rows={4}
                value={formulario.descripcion}
                onChange={(e) =>
                  actualizarCampo('descripcion', e.target.value)
                }
                style={estiloInput}
              />
            </label>

            <label>
              Fotografía del producto
              <input
                key={claveArchivo}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={seleccionarImagen}
                disabled={guardando}
                style={estiloInput}
              />
            </label>

            <small>
              Formatos JPG, PNG y WEBP.
              Tamaño máximo: 5 MB.
            </small>

            {(vistaPrevia || formulario.imagen) && (
              <div style={{
                padding: 18,
                border: '1px solid #dce7df',
                borderRadius: 10,
                background: '#f4f7f5'
              }}>
                <p>
                  <strong>
                    {archivoImagen
                      ? 'Nueva fotografía'
                      : 'Fotografía actual'}
                  </strong>
                </p>

                <img
                  src={vistaPrevia || formulario.imagen}
                  alt="Vista previa del producto"
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    width: 260,
                    height: 220,
                    objectFit: 'contain',
                    margin: '0 auto'
                  }}
                />

                {archivoImagen && (
                  <button
                    type="button"
                    className="boton-enlace"
                    onClick={quitarImagen}
                    disabled={guardando}
                  >
                    Quitar nueva imagen
                  </button>
                )}
              </div>
            )}

            {!archivoImagen && (
              <label>
                O utilizar una URL de imagen
                <input
                  type="text"
                  value={formulario.imagen}
                  onChange={(e) =>
                    actualizarCampo('imagen', e.target.value)
                  }
                  placeholder="https://... o /images/..."
                  style={estiloInput}
                />
              </label>
            )}

            {modo === 'editar' && (
              <small>
                Si no cambias la imagen, se conserva
                la fotografía actual.
              </small>
            )}

            {progreso && (
              <p role="status" style={{ color: '#168b34' }}>
                {progreso}
              </p>
            )}

            <button
              type="submit"
              className="boton-verde"
              disabled={guardando}
            >
              <Save size={17} />
              {' '}
              {guardando
                ? 'Guardando...'
                : modo === 'crear'
                  ? 'Registrar producto'
                  : 'Guardar cambios'}
            </button>
          </form>
        </section>
      )}

      {/* BUSCADOR Y FILTROS */}
      <section style={{
        marginTop: 38,
        marginBottom: 26
      }}>
        <h2 className="admin-subtitulo">
          Buscar productos
        </h2>

        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'end',
          marginTop: 15
        }}>
          <div style={{ flex: '2 1 240px' }}>
            <label htmlFor="buscar-producto">
              Nombre del producto
            </label>

            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                color="#738078"
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />

              <input
                id="buscar-producto"
                type="search"
                placeholder="Cable, reflector, toma..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                style={{
                  ...estiloInput,
                  paddingLeft: 40
                }}
              />
            </div>
          </div>

          <div style={{ flex: '1 1 190px' }}>
            <label htmlFor="categoria-filtro">
              Categoría
            </label>

            <select
              id="categoria-filtro"
              value={categoriaFiltro}
              onChange={(e) => {
                setCategoriaFiltro(e.target.value);
                setPagina(1);
              }}
              style={estiloInput}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* NUEVO FILTRO DE VISIBILIDAD */}
          <div style={{ flex: '1 1 160px' }}>
            <label htmlFor="estado-filtro">
              Visibilidad
            </label>

            <select
              id="estado-filtro"
              value={estadoFiltro}
              onChange={(e) => {
                setEstadoFiltro(e.target.value);
                setPagina(1);
              }}
              style={estiloInput}
            >
              <option value="todos">
                Todos
              </option>
              <option value="activos">
                Activos
              </option>
              <option value="ocultos">
                Ocultos
              </option>
            </select>
          </div>

          <button
            type="button"
            className="boton-secundario"
            onClick={limpiarFiltros}
          >
            <X size={16} />
            Limpiar
          </button>
        </div>
      </section>

      {/* LISTADO */}
      <h2 className="admin-subtitulo">
        Productos encontrados ({total})
      </h2>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Visibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.length > 0 ? (
                productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>
                      {formatoCOP(
                        p.price_cop == null
                          ? null
                          : Number(p.price_cop)
                      )}
                    </td>

                    <td>
                      <span style={{
                        color: p.active
                          ? '#168b34'
                          : '#b42318',
                        fontWeight: 600
                      }}>
                        {p.active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>

                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        flexWrap: 'wrap'
                      }}>
                        <button
                          type="button"
                          className="boton-enlace"
                          onClick={() => abrirEdicion(p)}
                          disabled={!!cambiandoEstado}
                        >
                          <Pencil size={15} />
                          {' '}Editar
                        </button>

                        {/* NUEVO BOTÓN */}
                        <button
                          type="button"
                          className="boton-enlace"
                          onClick={() =>
                            cambiarVisibilidad(p)
                          }
                          disabled={!!cambiandoEstado}
                          style={{
                            color: p.active
                              ? '#b42318'
                              : '#168b34'
                          }}
                        >
                          {p.active
                            ? <EyeOff size={15} />
                            : <Eye size={15} />}

                          {' '}
                          {cambiandoEstado === p.id
                            ? 'Guardando...'
                            : p.active
                              ? 'Ocultar'
                              : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="sin-registros"
                  >
                    No hay productos con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINACIÓN */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14,
        marginTop: 24
      }}>
        <p style={{ margin: 0, color: '#738078' }}>
          Mostrando {desde}–{hasta} de {total}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              setPagina((p) => Math.max(1, p - 1))
            }
            disabled={pagina === 1 || cargando}
          >
            <ChevronLeft size={17} />
            Anterior
          </button>

          <strong>
            {pagina} de {paginas}
          </strong>

          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              setPagina((p) =>
                Math.min(paginas, p + 1)
              )
            }
            disabled={pagina >= paginas || cargando}
          >
            Siguiente
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <p
        className="aclaracion-catalogo"
        style={{ marginTop: 22 }}
      >
        Ocultar un producto no elimina su
        información ni sus cotizaciones anteriores.
        Puedes volver a activarlo cuando quieras.
      </p>

    </main>
  );
}
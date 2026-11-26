import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Layout from './Components/Layout';

import { TiendaProvider } from './Context/TiendaContext';
import { AuthProvider } from './Context/AuthContext';
import { useAuth } from './Hooks/useAuth';

import Inicio from './Pages/Inicio';
import Productos from './Pages/Productos';
import DetalleProducto from './Pages/DetalleProducto';
import Carrito from './Pages/Carrito';
import Login from './Pages/Login';
import Cotizaciones from './Pages/Cotizaciones';
import CotizacionImprimir from './Pages/CotizacionImprimir';
import PanelAdmin from './Pages/PanelAdmin';
import GestionProductos from './Pages/GestionProductos';
import Info from './Pages/Info';

// PROTEGER RUTAS PRIVADAS

function RutaPrivada({ admin = false, children }) {
  const { usuario, cargando, esAdmin } = useAuth();

  if (cargando) {
    return (
      <main className="seccion-contenido">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (admin && !esAdmin) {
    return (
      <main className="seccion-contenido">
        <h1>Acceso restringido</h1>
        <p>
          Esta sección es exclusiva para
          administradores autorizados de DEC.
        </p>
      </main>
    );
  }

  return children;
}

// RUTAS DE LA APLICACIÓN

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TiendaProvider>
          <Routes>

            {/* PÁGINAS CON ENCABEZADO Y PIE */}
            <Route element={<Layout />}>

              {/* PÚBLICAS */}
              <Route path="/" element={<Inicio />} />

              <Route
                path="/productos"
                element={<Productos />}
              />

              <Route
                path="/productos/:id"
                element={<DetalleProducto />}
              />

              <Route
                path="/carrito"
                element={<Carrito />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              {/* CLIENTES */}
              <Route
                path="/cotizaciones"
                element={
                  <RutaPrivada>
                    <Cotizaciones />
                  </RutaPrivada>
                }
              />

              {/* ADMINISTRACIÓN */}
              <Route
                path="/admin"
                element={
                  <RutaPrivada admin>
                    <PanelAdmin />
                  </RutaPrivada>
                }
              />

              {/* GESTIÓN DE PRODUCTOS */}
              <Route
                path="/admin/productos"
                element={
                  <RutaPrivada admin>
                    <GestionProductos />
                  </RutaPrivada>
                }
              />

              {/* VISTAS DE DEMOSTRACIÓN */}
              <Route
                path="/vista-historial-demo"
                element={<Cotizaciones demo />}
              />

              <Route
                path="/vista-admin-demo"
                element={<PanelAdmin demo />}
              />

              {/* INFORMACIÓN */}
              <Route
                path="/categorias"
                element={<Info tipo="categorias" />}
              />

              <Route
                path="/marcas"
                element={<Info tipo="marcas" />}
              />

              <Route
                path="/nosotros"
                element={<Info tipo="nosotros" />}
              />

              <Route
                path="/contacto"
                element={<Info tipo="contacto" />}
              />

              <Route
                path="*"
                element={<Info tipo="404" />}
              />

            </Route>

            {/* PDF SIN ENCABEZADO NI PIE */}
            <Route
              path="/cotizacion/:id/imprimir"
              element={<CotizacionImprimir />}
            />

          </Routes>
        </TiendaProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
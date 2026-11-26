import {
  Outlet,
  useLocation
} from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import ChatDEC from './ChatDEC';
import AvisoEntregas from './AvisoEntregas';

export default function Layout() {
  const location = useLocation();

  // Mostrar el aviso únicamente en Inicio.
  const esPaginaInicio = location.pathname === '/';

  return (
    <div className="app-layout">

      {/* ENCABEZADO DE DEC */}
      <Header />

      {/* AVISO DE ENTREGAS SOLO EN INICIO */}
      {esPaginaInicio && <AvisoEntregas />}

      {/* CONTENIDO DE LA PÁGINA */}
      <Outlet />

      {/* PIE DE PÁGINA */}
      <Footer />

      {/* CHAT EN TIEMPO REAL */}
      <ChatDEC />

    </div>
  );
}
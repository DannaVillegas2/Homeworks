import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Inicio from "./pages/Inicio";
import Perfil from "./pages/Perfil";
import Configuracion from "./pages/Configuracion";
import Cuenta from "./pages/Cuenta";
import Seguridad from "./pages/Seguridad";
import Contrasena from "./pages/Contrasena";
import Ayuda from "./pages/Ayuda";
import Contacto from "./pages/Contacto";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/perfil" element={<Perfil />} />

          <Route
            path="/configuracion"
            element={<Configuracion />}
          />

          <Route
            path="/configuracion/cuenta"
            element={<Cuenta />}
          />

          <Route
            path="/configuracion/seguridad"
            element={<Seguridad />}
          />

          <Route
            path="/configuracion/contrasena"
            element={<Contrasena />}
          />

          <Route path="/ayuda" element={<Ayuda />} />

          <Route
            path="/ayuda/contacto"
            element={<Contacto />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
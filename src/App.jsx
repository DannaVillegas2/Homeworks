import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import Layout from './Components/Layout';
import {TiendaProvider} from './Context/TiendaContext';
import {AuthProvider} from './Context/AuthContext';
import {useAuth} from './Hooks/useAuth';
import Inicio from './Pages/Inicio';
import Productos from './Pages/Productos';
import DetalleProducto from './Pages/DetalleProducto';
import Carrito from './Pages/Carrito';
import Login from './Pages/Login';
import Cotizaciones from './Pages/Cotizaciones';
import PanelAdmin from './Pages/PanelAdmin';
import Info from './Pages/Info';
import CotizacionImprimir from './Pages/CotizacionImprimir';
function RutaPrivada({admin=false,children}){
  const {usuario,cargando,esAdmin}=useAuth();
  if(cargando)return <main className="seccion-contenido">Verificando sesión…</main>;
  if(!usuario)return <Navigate to="/login" replace/>;
  if(admin&&!esAdmin)return <main className="seccion-contenido"><h1>Acceso restringido</h1><p>Este panel solo está disponible para administradores autorizados.</p></main>;
  return children;
}
export default function App(){return <BrowserRouter><AuthProvider><TiendaProvider><Routes>
  <Route element={<Layout/>}>
    <Route path="/" element={<Inicio/>}/>
    <Route path="/productos" element={<Productos/>}/>
    <Route path="/productos/:id" element={<DetalleProducto/>}/>
    <Route path="/carrito" element={<Carrito/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/cotizaciones" element={<RutaPrivada><Cotizaciones/></RutaPrivada>}/>
    <Route path="/vista-historial-demo" element={<Cotizaciones demo/>}/>
    <Route path="/admin" element={<RutaPrivada admin><PanelAdmin/></RutaPrivada>}/>
    <Route path="/vista-admin-demo" element={<PanelAdmin demo/>}/>
    <Route path="/categorias" element={<Info tipo="categorias"/>}/>
    <Route path="/marcas" element={<Info tipo="marcas"/>}/>
    <Route path="/nosotros" element={<Info tipo="nosotros"/>}/>
    <Route path="/contacto" element={<Info tipo="contacto"/>}/>
    <Route path="*" element={<Info tipo="404"/>}/>
  </Route>
  <Route path="/cotizacion/:id/imprimir" element={<CotizacionImprimir/>}/>
</Routes></TiendaProvider></AuthProvider></BrowserRouter>}

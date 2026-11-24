import './Header.css';
import {useState} from 'react';
import {Link,NavLink,useNavigate} from 'react-router-dom';
import {Search,ShoppingCart,UserRound} from 'lucide-react';
import {useTienda} from '../Hooks/useTienda';
import {useAuth} from '../Hooks/useAuth';
const enlaces=[['Inicio','/'],['Productos','/productos'],['Categorías','/categorias'],['Marcas','/marcas'],['Nosotros','/nosotros'],['Contacto','/contacto']];
export default function Header(){
  const [texto,setTexto]=useState('');const ir=useNavigate();const {totalItems}=useTienda();const {usuario}=useAuth();
  const buscar=e=>{e.preventDefault();ir(`/productos${texto.trim()?`?q=${encodeURIComponent(texto.trim())}`:''}`);};
  return <header className="header-dec">
    <div className="header-principal">
      <Link to="/" className="header-logo" aria-label="Distribuidor Eléctrico de Cali, inicio"><span className="logo-dec">DEC</span><span className="nombre-dec">DISTRIBUIDOR ELÉCTRICO<br/>DE CALI S.A.S.</span></Link>
      <form className="header-buscador" onSubmit={buscar} role="search">
        <input type="search" value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Buscar productos, marcas o referencias..." aria-label="Buscar productos, marcas o referencias"/>
        <button type="submit" aria-label="Buscar"><Search size={19}/></button>
      </form>
      <div className="header-acciones">
        <Link to={usuario?'/cotizaciones':'/login'} className="header-accion"><UserRound size={18}/><span>{usuario?'Mi cuenta':'Iniciar sesión'}</span></Link>
        <Link to="/carrito" className="header-accion"><ShoppingCart size={18}/><span>Carrito ({totalItems})</span></Link>
      </div>
    </div>
    <nav className="header-navegacion" aria-label="Menú principal"><div className="nav-contenido">
      {enlaces.map(([nombre,ruta])=><NavLink key={nombre} to={ruta} end={ruta==='/'} className={({isActive})=>`header-enlace${isActive?' active':''}`}>{nombre}</NavLink>)}
    </div></nav>
  </header>;
}

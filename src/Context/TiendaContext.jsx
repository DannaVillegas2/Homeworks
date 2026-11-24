import {useEffect,useRef,useState} from 'react';
import {Pila} from '../Structures/Pila';
import {Cola} from '../Structures/Cola';
import {productosDemo} from '../data/productos';
import {TiendaContext} from './tienda-store';
const leer=(clave,defecto)=>{try{const valor=JSON.parse(localStorage.getItem(clave));return valor??defecto;}catch{return defecto;}};
export function TiendaProvider({children}){
  const [carrito,setCarrito]=useState(()=>leer('dec_carrito_demo',[]));
  const [cotizaciones,setCotizaciones]=useState(()=>leer('dec_cotizaciones_demo',[]));
  const [visitas,setVisitas]=useState(()=>leer('dec_visitas_demo',{}));
  const pila=useRef(new Pila());
  const [puedeDeshacer,setPuedeDeshacer]=useState(false);
  useEffect(()=>localStorage.setItem('dec_carrito_demo',JSON.stringify(carrito)),[carrito]);
  useEffect(()=>localStorage.setItem('dec_cotizaciones_demo',JSON.stringify(cotizaciones)),[cotizaciones]);
  useEffect(()=>localStorage.setItem('dec_visitas_demo',JSON.stringify(visitas)),[visitas]);
  const guardarCambio=(actualizar)=>{pila.current.apilar(carrito);setPuedeDeshacer(true);setCarrito(actualizar(carrito));};
  const agregar=(id,cantidad=1)=>{
    if(!productosDemo.some(p=>p.id===id))return;
    const n=Math.max(1,Math.min(99,Number(cantidad)||1));
    guardarCambio(actual=>{const fila=actual.find(p=>p.id===id);
      return fila?actual.map(p=>p.id===id?{...p,cantidad:Math.min(99,p.cantidad+n)}:p):[...actual,{id,cantidad:n}];});
  };
  const cambiarCantidad=(id,cantidad)=>guardarCambio(actual=>actual.map(p=>p.id===id?{...p,cantidad:Math.max(1,Math.min(99,cantidad))}:p));
  const quitar=id=>guardarCambio(actual=>actual.filter(p=>p.id!==id));
  const deshacer=()=>{const anterior=pila.current.desapilar();if(anterior!==null)setCarrito(anterior);setPuedeDeshacer(!pila.current.vacia);};
  const crearCotizacion=()=>{
    if(!carrito.length)return null;
    const cola=new Cola(cotizaciones);
    const nueva={id:`COT-${Date.now()}`,fecha:new Date().toISOString(),estado:'Pendiente',
      items:carrito.map(({id,cantidad})=>{const p=productosDemo.find(p=>p.id===id);return {id,nombre:p?.nombre||id,precio:p?.precio??null,cantidad};}),
      origen:'demo-local'};
    cola.encolar(nueva);setCotizaciones(cola.listar());pila.current.apilar(carrito);setPuedeDeshacer(true);setCarrito([]);return nueva;
  };
  const registrarVisita=id=>setVisitas(v=>({...v,[id]:(v[id]||0)+1}));
  const totalItems=carrito.reduce((s,p)=>s+p.cantidad,0);
  const subtotal=carrito.reduce((s,fil)=>{const p=productosDemo.find(x=>x.id===fil.id);return s+(p?.precio??0)*fil.cantidad;},0);
  const valores={carrito,cotizaciones,visitas,agregar,cambiarCantidad,quitar,deshacer,
    puedeDeshacer,crearCotizacion,registrarVisita,totalItems,subtotal,
    tienePreciosPendientes:carrito.some(f=>productosDemo.find(p=>p.id===f.id)?.precio==null)};
  return <TiendaContext.Provider value={valores}>{children}</TiendaContext.Provider>;
}

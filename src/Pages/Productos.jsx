import {useMemo,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import TarjetaProducto from '../Components/TarjetaProducto';
import {productosDemo,categorias} from '../data/productos';
import {buscarConTrie,masConsultados} from '../Helpers/busqueda';
import {useTienda} from '../Hooks/useTienda';

export default function Productos(){

  const [params,setParams]=useSearchParams();const [mostrar,setMostrar]=useState(8);
  const {visitas}=useTienda();
  const categoria=params.get('categoria')||'';
  const orden=params.get('orden')||'destacados';
  const q=params.get('q')||'';
  const productos=useMemo(()=>{

    let lista=buscarConTrie(productosDemo,q);

    if(categoria)lista=lista.filter(p=>p.categoria===categoria);
    if(orden==='alfabetico')lista=[...lista].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    if(orden==='precio')lista=[...lista].sort((a,b)=>(a.precio??Infinity)-(b.precio??Infinity));
    if(orden==='destacados')lista=[...lista].sort((a,b)=>Number(b.destacado)-Number(a.destacado));
    if(orden==='consultados'){

      const ranking=masConsultados(lista,visitas,lista.length);lista=ranking.filter(Boolean);

    }
    return lista;

  },[categoria,orden,q,visitas]);

  const cambiar=(clave,valor)=>{const siguiente=new URLSearchParams(params);if(valor)siguiente.set(clave,valor);else siguiente.delete(clave);setParams(siguiente);setMostrar(8);};
  return <main className="pagina-contenido catalogo-pagina"><h1>Catálogo de productos</h1><p className="subtitulo">Encuentra materiales eléctricos para tus proyectos.</p>
    
    <div className="barra-filtros"><label><span className="sr-only">Filtrar por categoría</span><select value={categoria} onChange={e=>cambiar('categoria',e.target.value)}><option value="">Todas las categorías</option>{categorias.map(c=><option key={c.slug}>{c.nombre}</option>)}<option>Extractores</option><option>Protecciones eléctricas</option></select></label>
    <label><span className="sr-only">Ordenar productos</span><select value={orden} onChange={e=>cambiar('orden',e.target.value)}><option value="destacados">Destacados</option><option value="alfabetico">Nombre A-Z</option><option value="precio">Menor precio</option><option value="consultados">Más consultados aquí</option></select></label></div>
    {q&&<p className="resultado-busqueda">Resultados para: <strong>{q}</strong> ({productos.length})</p>}
    {productos.length?<div className="productos-grid">{productos.slice(0,mostrar).map(p=><TarjetaProducto key={p.id} producto={p}/>)}</div>:<div className="estado-vacio"><h2>No encontramos productos</h2><p>Prueba otra palabra o categoría.</p></div>}
    
    {mostrar<productos.length&&<div className="cargar-contenedor"><button className="boton-secundario" onClick={()=>setMostrar(v=>v+8)}>Cargar más productos</button></div>}
  </main>;
}
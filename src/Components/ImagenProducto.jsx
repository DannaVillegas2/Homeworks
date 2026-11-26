import {useState} from 'react';
import {ImageOff} from 'lucide-react';
export default function ImagenProducto({src,alt='',className=''}){
  const [errorPath,setErrorPath]=useState(null);
  const fallo=errorPath===src;
  return <div className={`imagen-producto ${className}`}>
    {src&&!fallo?<img src={src} alt={alt} loading="lazy" onError={()=>setErrorPath(src)}/>:<div className="imagen-pendiente"><ImageOff size={33}/><small>Imagen pendiente<br/>de exportar de Figma</small></div>}
  </div>;
}

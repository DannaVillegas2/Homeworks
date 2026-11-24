import {Trie} from '../Structures/Trie';
import {HeapMaximo} from '../Structures/Heap';
import {Grafo} from '../Structures/Grafo';
import {normalizar} from '../data/productos';
export function buscarConTrie(productos,termino){
  const texto=normalizar(termino);if(!texto)return productos;
  const trie=new Trie();productos.forEach(p=>trie.insertar(`${p.nombre} ${p.marca} ${p.categoria}`,p.id));
  const partes=texto.split(/\s+/).filter(Boolean);
  const conjuntos=partes.map(p=>new Set(trie.buscarPrefijo(p)));
  const ids=new Set([...conjuntos[0]].filter(id=>conjuntos.every(s=>s.has(id))));
  return productos.filter(p=>ids.has(p.id)||normalizar(p.nombre).includes(texto));
}
export function masConsultados(productos,conteos={},limite=4){
  const heap=new HeapMaximo();productos.forEach((p)=>heap.insertar(p,(conteos[p.id]||0)*100+((p.destacado?1:0))));
  return Array.from({length:Math.min(limite,productos.length)},()=>heap.extraer());
}
export function crearGrafoProductos(productos){
  const g=new Grafo();productos.forEach(p=>g.vertice(p.id));
  // Orden visible en Figma para el detalle del reflector solar.
  g.conectar('reflector-solar-300w','cinta-led-neonflex');
  g.conectar('reflector-solar-300w','reflector-led-100w');
  g.conectar('reflector-solar-300w','protector-voltaje-120vac');
  productos.forEach((p,i)=>productos.slice(i+1).forEach(o=>{
    if(p.categoria===o.categoria|| (p.marca&&p.marca===o.marca))g.conectar(p.id,o.id);
  }));
  // Relaciones complementarias sugeridas, no afirmaciones comerciales.
  g.conectar('reflector-solar-300w','breaker-1x50a');
  g.conectar('toma-doble-15a','cable-duplex-2x18');
  g.conectar('tubo-pvc-media','cable-duplex-2x18');
  return g;
}

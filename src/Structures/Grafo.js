/** Grafo no dirigido de relaciones entre productos para recomendaciones. */
export class Grafo {
  constructor(){this.vecinos=new Map();}
  vertice(id){if(!this.vecinos.has(id))this.vecinos.set(id,new Set());}
  conectar(a,b){if(a===b)return;this.vertice(a);this.vertice(b);this.vecinos.get(a).add(b);this.vecinos.get(b).add(a);}
  relacionados(id,limite=3){const visitados=new Set([id]),cola=[id],resultado=[];
    while(cola.length&&resultado.length<limite){const actual=cola.shift();for(const vecino of this.vecinos.get(actual)??[]){
      if(visitados.has(vecino))continue;visitados.add(vecino);resultado.push(vecino);cola.push(vecino);if(resultado.length>=limite)break;}}
    return resultado;}
}

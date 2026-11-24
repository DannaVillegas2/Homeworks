/** Heap máximo para destacar los productos más consultados localmente. */
export class HeapMaximo {
  constructor(){this.datos=[];}
  insertar(valor,puntaje){
    const item={valor,puntaje};this.datos.push(item);let i=this.datos.length-1;
    while(i>0){const p=Math.floor((i-1)/2);if(this.datos[p].puntaje>=this.datos[i].puntaje)break;
      [this.datos[i],this.datos[p]]=[this.datos[p],this.datos[i]];i=p;}
  }
  extraer(){if(!this.datos.length)return null;const top=this.datos[0];const ultimo=this.datos.pop();
    if(this.datos.length){this.datos[0]=ultimo;let i=0;while(true){let m=i,l=2*i+1,r=l+1;
      if(l<this.datos.length&&this.datos[l].puntaje>this.datos[m].puntaje)m=l;
      if(r<this.datos.length&&this.datos[r].puntaje>this.datos[m].puntaje)m=r;
      if(m===i)break;[this.datos[i],this.datos[m]]=[this.datos[m],this.datos[i]];i=m;}}
    return top.valor;
  }
}

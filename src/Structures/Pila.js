/** Pila LIFO para deshacer la última modificación al carrito. */
export class Pila {
  constructor(limite = 30) { this.elementos=[];this.limite=limite; }
  apilar(valor) { this.elementos.push(structuredClone(valor)); if(this.elementos.length>this.limite)this.elementos.shift(); }
  desapilar() { return this.elementos.pop() ?? null; }
  get vacia(){return this.elementos.length===0;}
  limpiar(){this.elementos=[];}
}

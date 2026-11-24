/** Cola FIFO para solicitudes de cotización en este navegador (demostración). */
export class Cola {
  constructor(inicial=[]) { this.elementos=[...inicial]; }
  encolar(valor){this.elementos.push(valor);}
  desencolar(){return this.elementos.shift() ?? null;}
  primero(){return this.elementos[0]??null;}
  listar(){return [...this.elementos];}
  get longitud(){return this.elementos.length;}
}

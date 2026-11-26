import {normalizar} from '../data/productos';
class NodoTrie {constructor(){this.hijos=new Map();this.ids=new Set();}}
/** Índice Trie de prefijos por cada palabra del nombre del producto. */
export class Trie {
  constructor(){this.raiz=new NodoTrie();}
  insertar(texto,id){
    const palabras=new Set(normalizar(texto).split(/\W+/).filter(Boolean));
    for(const palabra of palabras){let nodo=this.raiz;
      for(const caracter of palabra){if(!nodo.hijos.has(caracter))nodo.hijos.set(caracter,new NodoTrie());nodo=nodo.hijos.get(caracter);nodo.ids.add(id);}
    }
  }
  buscarPrefijo(termino){let nodo=this.raiz;for(const letra of normalizar(termino)){nodo=nodo.hijos.get(letra);if(!nodo)return [];}return [...nodo.ids];}
}

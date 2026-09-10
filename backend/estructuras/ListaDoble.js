class Nodo{


constructor(dato){

this.dato=dato;
this.siguiente=null;
this.anterior=null;

}

}



class ListaDoble{


constructor(){

this.inicio=null;
this.fin=null;

}



agregar(dato){


let nuevo=new Nodo(dato);


if(!this.inicio){

this.inicio=nuevo;
this.fin=nuevo;


}else{


nuevo.anterior=this.fin;

this.fin.siguiente=nuevo;

this.fin=nuevo;


}



}



mostrar(){


let resultado=[];

let actual=this.inicio;


while(actual){

resultado.push(actual.dato);

actual=actual.siguiente;


}


return resultado;


}



}



module.exports=ListaDoble;
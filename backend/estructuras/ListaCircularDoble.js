class Nodo{


constructor(dato){

this.dato=dato;
this.siguiente=null;
this.anterior=null;

}


}




class ListaCircularDoble{


constructor(){

this.actual=null;

}



agregar(persona){


let nuevo=new Nodo(persona);


if(!this.actual){

this.actual=nuevo;

nuevo.siguiente=nuevo;
nuevo.anterior=nuevo;


}else{


nuevo.siguiente=this.actual.siguiente;

nuevo.anterior=this.actual;


this.actual.siguiente.anterior=nuevo;

this.actual.siguiente=nuevo;


}



}



mostrar(){


let lista=[];


if(!this.actual)
return lista;



let nodo=this.actual;


do{


lista.push(nodo.dato);


nodo=nodo.siguiente;


}while(nodo!=this.actual)



return lista;


}



}



module.exports=ListaCircularDoble;
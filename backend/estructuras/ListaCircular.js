class Nodo{


constructor(dato){

this.dato=dato;
this.siguiente=null;

}


}



class ListaCircular{


constructor(){

this.actual=null;

}



agregar(medico){


let nuevo=new Nodo(medico);



if(!this.actual){

this.actual=nuevo;

nuevo.siguiente=nuevo;


}else{


nuevo.siguiente=this.actual.siguiente;

this.actual.siguiente=nuevo;


}


}



siguienteMedico(){


if(this.actual){

this.actual=this.actual.siguiente;

}


return this.actual.dato;


}



obtenerActual(){

return this.actual.dato;

}


mostrar(){


let lista=[];


if(!this.actual)
return lista;


let inicio=this.actual;


do{


lista.push(inicio.dato);


inicio=inicio.siguiente;


}while(inicio!=this.actual)



return lista;


}



}


module.exports=ListaCircular;
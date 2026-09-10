class NodoPaciente{

    constructor(dato){
        this.dato=dato;
        this.siguiente=null;
    }

}


class ListaSimple{


constructor(){

    this.inicio=null;

}


agregar(paciente){

    let nuevo=new NodoPaciente(paciente);


    if(this.inicio==null){

        this.inicio=nuevo;

    }else{

        let actual=this.inicio;


        while(actual.siguiente){

            actual=actual.siguiente;

        }


        actual.siguiente=nuevo;

    }

}



eliminar(){

    if(this.inicio==null)
        return null;


    let paciente=this.inicio.dato;


    this.inicio=this.inicio.siguiente;


    return paciente;

}



mostrar(){

    let datos=[];

    let actual=this.inicio;


    while(actual){

        datos.push(actual.dato);

        actual=actual.siguiente;

    }


    return datos;

}



}


module.exports=ListaSimple;
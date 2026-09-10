import React from "react";
import {useEffect,useState} from "react";
import {historial} from "../api";


function Historial(){


const [datos,setDatos]=useState([]);



function cargar(){

    historial()
    .then(data=>{
        setDatos(data);
    });

}



useEffect(()=>{


cargar();


let intervalo=setInterval(
cargar,
2000
);


return()=>clearInterval(intervalo);



},[]);



return(

<div>


<h2>
Historial de atención
</h2>


<ul>


{

datos.map((p,index)=>(

<li key={index}>


Paciente:
{p.nombre}

<br/>

Motivo:
{p.motivo}


<br/>


Médico:

{
p.medico.nombre
}


</li>


))


}



</ul>


</div>


);



}


export default Historial;
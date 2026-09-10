import React from "react";

import {useEffect,useState} from "react";

import {
    obtenerPacientes,
    atender,
    agregarPaciente
} from "../api";


function Pacientes(){


const [pacientes,setPacientes]=useState([]);

const [nombre,setNombre]=useState("");

const [motivo,setMotivo]=useState("");



function cargarPacientes(){

    obtenerPacientes()
    .then(data=>{

        setPacientes(data);

    });

}



useEffect(()=>{


    cargarPacientes();


    let intervalo=setInterval(
        cargarPacientes,
        2000
    );


    return()=>clearInterval(intervalo);


},[]);





function guardarPaciente(){


    if(nombre==="" || motivo===""){

        alert("Ingrese todos los datos");

        return;

    }



    const nuevo={

        id:Date.now(),

        nombre:nombre,

        motivo:motivo

    };



    agregarPaciente(nuevo)
    .then(()=>{


        setNombre("");

        setMotivo("");

        cargarPacientes();


    });



}





function atenderPaciente(){


    atender()
    .then(()=>{

        cargarPacientes();

    });


}





return(


<div>


<h2>
Pacientes en espera
</h2>



<h3>
Registrar paciente
</h3>


<input

placeholder="Nombre del paciente"

value={nombre}

onChange={
(e)=>setNombre(e.target.value)
}

/>



<br/>


<input

placeholder="Motivo de consulta"

value={motivo}

onChange={
(e)=>setMotivo(e.target.value)
}

/>


<br/>


<button
onClick={guardarPaciente}
>

Agregar paciente

</button>




<hr/>




{

pacientes.length===0 ?

<p>
No hay pacientes esperando
</p>


:


<ul>


{

pacientes.map((p,index)=>(


<li key={index}>


<b>
{p.nombre}
</b>

-
{p.motivo}


</li>


))


}



</ul>


}



<button

onClick={atenderPaciente}

>

Atender siguiente paciente

</button>




</div>


);


}


export default Pacientes;
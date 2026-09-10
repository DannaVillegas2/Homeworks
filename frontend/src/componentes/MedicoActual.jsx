import React from "react";
import {
useEffect,
useState
}
from "react";


import {
medico
}
from "../api";



function MedicoActual(){


const [doctor,setDoctor]=useState({});



function cargar(){

medico()
.then(data=>{

setDoctor(data);

});


}



useEffect(()=>{


cargar();


let intervalo=setInterval(
cargar,
1000
);


return()=>clearInterval(intervalo);



},[]);




return(

<div>


<h2>
Médico de guardia
</h2>


{

doctor.nombre &&

<p>

Nombre:

{doctor.nombre}


<br/>


Especialidad:

{doctor.especialidad}


</p>

}



</div>


);


}



export default MedicoActual;
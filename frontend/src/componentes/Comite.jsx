import React from "react";
import {
useEffect,
useState
}
from "react";


function Comite(){


const [personas,setPersonas]=useState([]);



function cargar(){


fetch(
"http://localhost:3000/comite"
)

.then(res=>res.json())

.then(data=>{

setPersonas(data);

});


}



useEffect(()=>{


cargar();


},[]);



return(

<div>


<h2>
Comité administrativo
</h2>


<ul>


{

personas.map(
(persona,index)=>(

<li key={index}>

{persona}

</li>

)

)

}


</ul>


</div>


);


}


export default Comite;
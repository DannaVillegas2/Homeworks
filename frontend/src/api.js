const URL="http://localhost:3000";


export async function obtenerPacientes(){

return fetch(URL+"/pacientes")
.then(r=>r.json());

}



export async function atender(){

return fetch(URL+"/atender",
{
method:"POST"
})
.then(r=>r.json());

}


export async function agregarPaciente(p){

return fetch(URL+"/pacientes",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(p)

}

);

}


export async function historial(){

return fetch(URL+"/historial")
.then(r=>r.json());

}


export async function medico(){

return fetch(URL+"/medico")
.then(r=>r.json());

}
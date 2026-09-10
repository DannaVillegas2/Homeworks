const express=require("express");

const cors=require("cors");


const ListaSimple=require("./estructuras/ListaSimple");
const ListaDoble=require("./estructuras/ListaDoble");
const ListaCircular=require("./estructuras/ListaCircular");
const ListaCircularDoble=require("./estructuras/ListaCircularDoble");


const app=express();


app.use(cors());

app.use(express.json());



let pacientes=new ListaSimple();

let historial=new ListaDoble();

let medicos=new ListaCircular();

let comite=new ListaCircularDoble();



medicos.agregar(
{
nombre:"Dr. Carlos",
especialidad:"Urgencias"
});


medicos.agregar(
{
nombre:"Dra. Ana",
especialidad:"Pediatría"
});


medicos.agregar(
{
nombre:"Dr. Juan",
especialidad:"Cirugía"
});



comite.agregar("Director");
comite.agregar("Administrador");
comite.agregar("Coordinador");




// CAMBIO CADA 10 SEGUNDOS

setInterval(()=>{


console.log(
"Nuevo medico:",
medicos.siguienteMedico()
);


},10000);





// AGREGAR PACIENTE

app.post("/pacientes",(req,res)=>{


pacientes.agregar(req.body);


res.json({
mensaje:"Paciente agregado"
});


});





// LISTAR ESPERA


app.get("/pacientes",(req,res)=>{


res.json(
pacientes.mostrar()
);


});




// ATENDER


app.post("/atender",(req,res)=>{


let paciente=pacientes.eliminar();


if(paciente){


paciente.medico=
medicos.obtenerActual();


historial.agregar(paciente);



res.json({

mensaje:"Paciente atendido",
paciente

});


}else{


res.json({

mensaje:"No hay pacientes"

});


}



});





app.get("/historial",(req,res)=>{


res.json(
historial.mostrar()
);


});





app.get("/medico",(req,res)=>{


res.json(
medicos.obtenerActual()
);


});





app.get("/comite",(req,res)=>{


res.json(
comite.mostrar()
);


});






app.listen(3000,()=>{

console.log(
"Servidor funcionando puerto 3000"
);


});
import React from "react";

import Pacientes from "./componentes/Pacientes";
import Historial from "./componentes/Historial";
import MedicoActual from "./componentes/MedicoActual";
import Comite from "./componentes/Comite";


function App(){

    return(

        <div>

            <h1>
                Sistema de Gestión Clínica
            </h1>


            <MedicoActual/>


            <hr/>


            <Pacientes/>


            <hr/>


            <Historial/>


            <hr/>


            <Comite/>


        </div>

    );

}


export default App;
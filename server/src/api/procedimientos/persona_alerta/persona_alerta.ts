import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'




export class persona_alerta extends BaseDeDatosController
{

       constructor(){
        super()
       }


       async actualiza_persona(res,accion:action_server){
          var resultTotal
        resultTotal= await super._actualiza_persona_alerta(res,accion)
        console.log("reuslt persona alerta",resultTotal) 
        return res.status(200).send(resultTotal)
     }  
    
     async elimina_persona_alerta(res,accion:action_server){
        var resultTotal
        console.log("llama elimina alerta")
        resultTotal= await super.elimina_persona_alerta(res,accion)
        return res.status(200).send(resultTotal)
     }  
}

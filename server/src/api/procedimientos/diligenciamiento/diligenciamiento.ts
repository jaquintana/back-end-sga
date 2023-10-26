import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'


export class diligenciamiento extends BaseDeDatosController
{

       constructor(){
        super()
       }
   
       async actualiza_delito(res,accion:action_server){
        var resultTotal
        resultTotal= await super.actualiza_delito(res,accion)
        return res.status(200).send(resultTotal)
     }  

     async actualiza_denuncia(res,accion:action_server){
        var resultTotal
        resultTotal= await super.actualiza_denuncia(res,accion)
        return res.status(200).send(resultTotal)
     }  
     async elimina_denuncia(res,accion:action_server){
        var resultTotal
        resultTotal= await super.elimina_denuncia(res,accion)
        return res.status(200).send(resultTotal)
     }  

     async actualiza_persona_denunciada(res,accion:action_server){
        var resultTotal
        resultTotal= await super.actualiza_persona_denunciada(res,accion)
        return res.status(200).send(resultTotal)
     }

     async elimina_persona_denuncia
     (res,accion:action_server){
        var resultTotal
        resultTotal= await super.elimina_persona_denuncia(res,accion)
        return res.status(200).send(resultTotal)
     }  


    
}

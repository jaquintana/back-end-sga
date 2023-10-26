import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'




export class agrega_actividad extends BaseDeDatosController
{

       constructor(){
        super()
       }
     async agrega_actividad(res,accion:action_server){
        var resultTotal
        //1 cambia estado.
         resultTotal= await super._agrega_actividad(accion)
           
        return res.status(200).send(resultTotal)
     }  


     async actualiza_actividad(res,accion:action_server){
      var resultTotal
      resultTotal= await super._actualiza_actividad(res,accion)
      return res.status(200).send(resultTotal)
   }  

   async actualiza_alerta(res,accion:action_server){
      var resultTotal
      resultTotal= await super._actualiza_alerta(res,accion)
      return res.status(200).send(resultTotal)
   }  
   async finaliza_alerta(res,accion:action_server){
      var resultTotal
      resultTotal= await super._finaliza_alerta(res,accion)
      return res.status(200).send(resultTotal)
   }


}

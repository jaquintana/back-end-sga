import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'




export class agrega_documento extends BaseDeDatosController
{

       constructor(){
        super()
       }
     async agrega_documento(res,accion:action_server){
        var resultTotal
       
         resultTotal= await super._agrega_documento(accion)
           
        return res.status(200).send(resultTotal)
     }  

     async actualiza_documento(res,accion:action_server){
      var resultTotal
      //1 cambia estado.
       
      resultTotal= await super._actualiza_documento(res,accion)
           
      return res.status(200).send(resultTotal)
   }  

   
   async actualiza_documento_imagen(res,accion:action_server){
      var resultTotal
      //1 cambia estado.
       
      resultTotal= await super._actualiza_documento_imagen(res,accion)
           
      return res.status(200).send(resultTotal)
   }  


    
}

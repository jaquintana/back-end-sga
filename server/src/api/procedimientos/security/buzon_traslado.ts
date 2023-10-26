import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'




export class traslado_buzon extends BaseDeDatosController
{

       constructor(){
        super()
       }
     async traslado_buzon(res,accion:action_server){
        var resultTotal
        //1 cambia estado.
        if (accion.data["alertas"] && accion.data["alertas"].length>=1){
         resultTotal= await super._cambia_estado(accion.data["alertas"],accion.data["persona"].id,accion.usuario)
        }
        return res.status(200).send(resultTotal)
     }  
   
}

import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'




export class filtro_de_datos extends BaseDeDatosController
{

       constructor(){
        super()
       }


       async filtro_de_datos(res,accion:action_server){
         

        var resultTotal
        resultTotal= await super._filtro_de_datos(res,accion)
        return res.status(200).send(resultTotal)
     }  
    
}

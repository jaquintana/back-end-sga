import { action_server } from "../../types/action_server_types"
import {BaseDeDatosController } from '../../controllers/basededatos.controller'
const { check, validationResult } = require('express-validator');
const expressValidator = require('express-validator')

import * as bcrypt from 'bcrypt'


export class contrasena extends BaseDeDatosController
{

       constructor(){
        super()
       }

      private  async compare_contrasena(res,payload:action_server){
            let contrasena=await super._contrasena(payload.usuario)
            let result=await bcrypt.compare(payload.set_id['contrasena_actual'],contrasena.data[0].contrasena)
           if (!result){
             return res.status(400).json({success: false, data:null, errors:"la contraseña no es la correcta"})
           }else{
              if (payload.set_id['nueva_contrasena']){
                      if (payload.set_id['nueva_contrasena'].length>=6){
                            await super._cambio_contrasena(payload.usuario,payload.set_id['nueva_contrasena'])
                            return res.status(200).json({success: true, message:"la contraseña fue actualizada", errors:null})
                      }else
                      return res.status(400).json({success: false, data:null, errors:"la contraseña debe tener al menos 6 caracteres y como maximo 8"})
             }         
           }
             return res.status(200).json({success: false, data:"la contraseña fue actualizada correctamente", errors:null})
      }

     async elimina_usuario(res,accion:action_server){
        let resultTotal= await super._elimina_usuario(accion.usuario,accion.set_id['elimina_usuario'],accion)
         return res.status(200).json({success: true, data:"El usuario fue eliminado", errors:null})
       
     }  
     async cambio_contrasena(res,accion:action_server){
        console.log("cambio contrasena",accion)
         this.compare_contrasena(res,accion)
      }  
}

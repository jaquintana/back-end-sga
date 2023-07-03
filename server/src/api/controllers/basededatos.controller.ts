import { ApplicationController } from './'
import  mg_usuario= require('../../db/models/mg_usuario.model')
import db from '../../db/models/index'

export class BaseDeDatosController extends ApplicationController {
 
    constructor(){
        super('')
    }
       
    async _validateUserGroup(user:number){
        return  await super._query("SELECT grupo_id FROM mg_grupo_x_usuario WHERE  activo=1 and usuario_id =" + user)
      }
    async _validateActionServer(action:number){
        return  await super._query("SELECT class,function,id,nombre,modelo_id,ref_id,tipo_accion_id,set_id FROM mg_accion_servidor WHERE  id =" + action)
     }
     async _contrasena(usuario:number)  {
       return await super._query("SELECT contrasena from mg_usuario where activo='S' and eliminado='N' and id="+usuario)
    }

     async _cambio_contrasena(usuario:number,contrasena)  {
     return await super.findAndUpdateUserContrasena('mg_usuario',usuario,contrasena)

   }
}   
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
     
     async _elimina_usuario(usuario:number,field,accion)  {
      return await super.findAndUpdateUserElimina('mg_usuario',usuario,accion)
     }

     async _cambia_estado(alerta:any[],usuarioTraslado:any,usuarioActualiza:number)  {
      return await super.BuscayActualizaEsadoAlerta(alerta,usuarioTraslado,usuarioActualiza)
     }

     
     async _agrega_documento(accion)  {
      return await super.BuscaAgregaDocumento(accion)
     }

     async _actualiza_documento(res,accion)  {
      return await super.BuscaActualizaDocumento(res,accion)
     }

     async _actualiza_actividad(res,accion)  {
      return await super.BuscaActualizaActividad(res,accion)
     }

     async _actualiza_documento_imagen(res,accion)  {
      //return await super.BuscaActualizaDocumentoImagen(res,accion)
     }
     async _agrega_actividad(accion)  {
      return await super.BuscaAgregaActividad(accion)
     }

     async _actualiza_alerta(res,accion)  {
      return await super.BuscaActualizaAlerta(res,accion)
     }

     async _finaliza_alerta(res,accion)  {
      return await super.BuscaActualizaAlerta(res,accion)
     }


     insertInAnyModel(res: any, nameModel: any,data:any){
      return super._createDataAnyModel(res,nameModel,data)
    }

    _filtro_de_datos(res: any, accion:any){
      return super._filtro_de_datos(res,accion)
    }  
    actualiza_delito(res: any, accion:any){
      return super.actualizaDelito(res,accion)
    }  
    actualiza_denuncia(res: any, accion:any){
      return super.actualizaDenuncia(res,accion)
    }  
    elimina_denuncia(res: any, accion:any){
      return super.eliminaDenuncia(res,accion)
    }  
    actualiza_persona_denunciada(res: any, accion:any){
      return super.actualizaPersonaDenuncia(res,accion)
    }
    elimina_persona_denuncia(res: any, accion:any){
      return super.eliminaPersonaDenuncia(res,accion)
    }  
    _actualiza_persona_alerta(res: any, accion:any){
      return super.actualizaPersonaAlerta(res,accion)
    }
    elimina_persona_alerta(res: any, accion:any){
      return super.eliminaPersonaAlerta(res,accion)
    } 

}   
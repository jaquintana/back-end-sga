const _ = require('lodash')
import db from '../../db/models/index'
import {validationResult } from 'express-validator';
import { sequelize} from '../../config/connection'
import { errorHandler } from '../error/handler-error';
import { AppError,HttpCode } from '../error/app-error';
import moment from 'moment-timezone';
import { drsc_cat_admisibilidad } from '../../db/models/drsc_cat_admisibilidad.model';




export class  DatabaseByName{
  public nameModel:string = "";
   constructor(m){
    this.nameModel = m
   }
   async findNameModel(){
    try{
      let result = await db['sys_model'].findOne({where:{name:this.nameModel}})
      return {success:true,data: result.model}
  }catch(error){
      return {success:false,data:null,error:error}
  }

  }

}

export class ApplicationController {
  errors: any
  public model  
   constructor(m) {
    this.model = m
  }

  async _updateModel(res,nameModel,whereOption:any,fieldToUpdate:any){
     
     try{
     
      let result = await db[nameModel].update(fieldToUpdate,whereOption)
      return res.status(200).json({success: true, data:fieldToUpdate, errors:null})
    }catch(error:any){ 
      
      errorHandler.handleError(
        new AppError({
          httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
          description: error,
        }),res);
      
   }
  }

  //esta funcion es similar a la anterior unicamente no retorna res al cliente, 
  // ya que es utilizada en un ciclo while, donde se actualizan muchos registros.
  async _updateManyModel(res,nameModel,whereOption:any,fieldToUpdate:any){
     
    try{
    let result= await db[nameModel].update(fieldToUpdate,whereOption)
    
    return result
   }catch(error:any){ 
     
     errorHandler.handleError(
       new AppError({
         httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
         description: error,
       }),res);
     
  }
 }

  async _insertInModel(res,nameModel,fieldToUpdate:any){
     
    try{
    
     let result = await db[nameModel].create(fieldToUpdate)
     return res.status(200).json({success: true, data:fieldToUpdate, errors:null})
   }catch(error:any){ 
     
     errorHandler.handleError(
       new AppError({
         httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
         description: error,
       }),res);
     
  }
 }

  async _createModel(res,fieldToCreate:any){

    try{
     await sequelize.sync();
     
     let result = (await db[this.model].create(fieldToCreate)).get({plain:true})
     return res.status(200).json({success: true, data:result, errors:null})
   }catch(error:any){
     
     errorHandler.handleError(
       new AppError({
         httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
         description: error,
       }),res);
     
  }
 }
 async _updateAnyModel(model:string,updateCondition:any,fieldToUpdate:any){
  try{
    
  const result= await db[model].update(fieldToUpdate,updateCondition)
    return {success:true,data:{fieldToUpdate,updateCondition}, error:null}
    }catch(error:any){
  if (error.name=="SequelizeUniqueConstraintError")
      return {success:false,data:null,error: [{message:  error.name+ ' '+error.message+ " revise que no se repita el correo"}]}
  else  
     return {success:false,data:null,error: [{message:  error.name+ ' '+error.message+ " revise los campos obligatorios"}]}

    }
}
   

  /* es igual a la anterior unicamente que no retorna un res status al cliente
    por lo que permite ser llamada multiples veces antes de dar la respuesta al cliente.
  */
 async _createManyModel(res,model,fieldToCreate:any){

  try{
   //await sequelize.sync();
   let result = await db[model].create(fieldToCreate)//).get({plain:true})
   return result
 }catch(error:any){
   errorHandler.handleError(
     new AppError({
       httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
       description: error,
     }),res);
}
}

 

 async _createChildModel(res,fieldToCreate:any,arrayModel:any){

  try{
    await sequelize.sync();
    const         one2Many                   = await db['sys_one2many'].findAll({ raw:true,where:{children_id:arrayModel.action.res_model,father_id:arrayModel.action.src_model}})
    fieldToCreate[one2Many[0].foreignKey_id] = one2Many[0].father_id
    let result = (await db[this.model].create(fieldToCreate)).get({plain:true})
    Object.hasOwn(result, 'createAt')?delete result.createAt: null;
    Object.hasOwn(result,'insertAt')? delete result.insertAt: null;
    Object.hasOwn(result,'updateAt')? delete result.updateAt: null;
    
   return res.status(200).json({success: true, data:result, errors:null})
 }catch(error:any){
      errorHandler.handleError(
     new AppError({
       httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
       description: error,
     }),res);
   
}
}

  async setChangeModel(res,nameModel){
      
      try{
          const result = await db['mg_modelo'].findOne({ raw:true,where:{name:nameModel}})
         
          this.model = result.model
          return result
      }catch(error:any){
          errorHandler.handleError(
            new AppError({
              httpCode   : HttpCode.INTERNAL_SERVER_ERROR,
              description: error,
            }),res);
      }
  }

  
  
  
    
  async _findOneAnyModel(model:string, condition:any) {
    try{
        const result=await db[model].findOne(condition)
        return {success:true,data:result }
    }catch(error){
        return {success:false,data:null,error:error}
    }
}


async _findAllAnyModel(res,model:string, condition:any) {
  try{
      return {success:true,data: await db[model].findAll(condition)}
  }catch(error){
      return {success:false,data:null,error:error}
  }
}

  async _createDataAnyModel(res,model:string,data:any){
    try{
           const result=(await db[model].create(data,{individualHooks: true})).get({plain:true})
         return {success:true,data:result, error:null}
    }catch(error:any){
       
      if (error.name=="SequelizeUniqueConstraintError")
          return {success:false,data:null,error: [{message: null+ ' '+error.message+ " revise que no se repita un campo"}]}
      else  
         return {success:false,data:null,error: [{message:  error.name+ ' '+error.message+ " revise los campos obligatorios"}]}

    }
  }
    

  
  _create(req, res, options = {}, callback = null) {
      const resultValidation = validationResult(req.body)
      let   model            = this.model
        if (resultValidation.isEmpty()) {
            req.body = _.pick(_.cloneDeep(req.body), req.pick || [])
            return  db[model].create(req.body)
            .then(appuser => res.status(201).send({success: true, data: appuser, message: options['message'] || 'Successfully Created'}))
            .catch(error => {
              
              return res.json(error)})
        } else {
             res.boom.badRequest('Validation errors', resultValidation.mapped())
      }
      
  }


  _list(req, res, options = {}, callback = null) {
    let model = this.model
    return db[model].findAll({ include: [{ all: true }] }).then(data =>
      res.status(200).send({success: true, data: data}))
      .catch(error => res.boom.badRequest(error))
  }

  _findOne(req, res) {
    const resultValidation = validationResult(req.body)
    let   model            = this.model
    if (resultValidation.isEmpty()) {
          
            return db[model].findOne(req.condition || {}).then(data => {
              if (data)
                return {success:true,data:data}
              else
                return {success:false,error: 'Not Found '+model + JSON.stringify(req.condition)}
                    
              }
            ).catch(error => {return {success:false,error:error}})
          } else {
              return {success:false,error:resultValidation.mapped()}
          //res.boom.badRequest('Validation errors', resultValidation.mapped())
        }
      
  }

  async  xfindAll(model:string,domain:string|object,context:string|object){
   return await db[model].findAll({
     attributes: domain,
     where     : context,
     raw       : true
   })
  }

  _findAll(success,errorDb,errorValidate,req, res, callback) {
    
    const resultValidation = validationResult(req.body)
    let   model            = this.model
    let   lan              = req.headers['accept-language']

    res.setLocale(lan)
    if (resultValidation.isEmpty()) {
          return  db[model].findAll(req.condition || {}).then(data => {
                if (typeof(callback) === 'function')
                   res.status(200).send({success: true, data: data,message: res.__(success)})
                }
            ).catch(error => {
                               res.status(400).send({success: false,message: res.__(errorDb)+ error})})
          } else {
            return res.status(400).send( res.__(errorValidate), resultValidation.mapped())
        }
      
  }

  async findAndUpdateUserContrasena(model:string,usuario:number,contrasena:string){
       let user=await db[model].findOne({where:{id:usuario}}, { individualHooks: true})
       return await user.update({contrasena:contrasena})
  }

  async findAndUpdateUserElimina(model:string,usuario:number,accion:any){
  
     let user=await db[model].findOne({where:accion.ref_id}, { individualHooks: true})
     user.update({fecha_eliminado: new Date(moment().tz("America/Guatemala").format())})
     return await user.update(accion.set_id)
   
  }

  async BuscaAgregaActividad(accion){
    let array:any={}
            
            accion.set_id.push({alerta_id:accion.ref_id.alerta_id})
            accion.set_id.push({usuario_creo_id:accion.usuario})
            accion.set_id.push({usuario_actualizo_id:accion.usuario})
            
            accion.set_id.map(object => 
              {   Object.entries(object).find(([key, value]) => {
                  array[key] = value
              })
            })  
            
            let resultado= await this._createDataAnyModel(null,'drsc_actividad_alerta',array)
            
            
            let nombre=await db["drsc_cat_tipo_actividad"].findOne({where:{id:resultado.data['tipo_actividad_id']}}, { individualHooks: true})
            resultado.data["nombre_tipo_actividad"]=nombre.dataValues.nombre
            nombre=await db["drsc_cat_estado_actividad"].findOne({where:{id:resultado.data['estado_actividad_id']}}, { individualHooks: true})
            resultado.data["nombre_estado_actividad"]=nombre.dataValues.nombre
            resultado.data["color_estado_actividad"]=nombre.dataValues.color
            nombre=await db["mg_usuario"].findOne({where:{id:resultado.data['propietario_id']}}, { individualHooks: true})
            resultado.data["propietario"]=nombre.dataValues.nombre+' '+ nombre.dataValues.primer_apellido
            
            return resultado
      }  

   

  async BuscaAgregaDocumento(accion){
    let array:any={}
            
            accion.set_id.push(accion.ref_id)
            accion.set_id.push({usuario_creo_id:accion.usuario})
            accion.set_id.push({usuario_actualizo_id:accion.usuario})
            
            accion.set_id.map(object => 
              {   Object.entries(object).find(([key, value]) => {
                  array[key] = value
              })
            })  
            let resultado= await this._createDataAnyModel(null,'drsc_documento_alerta',array)
            let nombre=await db["drsc_cat_tipo_documento"].findOne({where:{id:resultado.data['tipo_documento_id']}}, { individualHooks: true})
            resultado.data["nombre_tipo"]=nombre.dataValues.nombre
            return resultado
      }  

      async eliminaDenuncia(res,accion){
        let array={eliminado:'S', activo:'N',usuario_elimino:accion.usuario,fecha_eliminado:new Date(moment().tz("America/Guatemala").format())}
              if (accion.ref_id.id>=0){
                let result= await this._updateAnyModel('drsc_denuncia', {where:accion.ref_id},array )
                return result
               }
       }

       async eliminaPersonaDenuncia(res,accion){
        let array={eliminado:'S', activo:'N',usuario_elimino:accion.usuario,fecha_eliminado:new Date(moment().tz("America/Guatemala").format())}
              if (accion.ref_id.id>=0){
                let result= await this._updateAnyModel('drsc_denuncia_persona', {where:accion.ref_id},array )
                return result
               }
       }

       async eliminaPersonaAlerta(res,accion){
        console.log("eliminar persona alerta",accion)
        let array={eliminado:'S', activo:'N',usuario_elimino_id:accion.usuario,fecha_eliminado:new Date(moment().tz("America/Guatemala").format())}
              if (accion.ref_id.id>=0){
                let result= await this._updateAnyModel('drsc_alerta_persona', {where:accion.ref_id},array )
                console.log("result elimina persona alerta",result)
                return result
               }
       }


      async actualizaDenuncia(res,accion){
        let array:any={}
        
        if (accion.ref_id.id==null||accion.ref_id.id==0){ //es un registro nuevo
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.push({usuario_creo_id:accion.usuario})
          accion.set_id.push({alerta_id:accion.ref_id.alerta_id})
          accion.set_id.push({id:accion.ref_id.id})
          accion.set_id.map(object => 
            {   Object.entries(object).find(([key, value]) => {
                array[key] = value
            })
          })  
          let result:any
          result= await this._createDataAnyModel(null,'drsc_denuncia',array)
          
          return result
        }
        else
        {
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.map(object => 
           {   Object.entries(object).find(([key, value]) => {
               array[key] = value
           })
         })  
         
         let result= await this._updateAnyModel('drsc_denuncia', {where:accion.ref_id} ,array)
           return result

        }
      }  

      async actualizaPersonaDenuncia(res,accion){
        let array:any={}
        
        if (accion.ref_id.id==null||accion.ref_id.id==0){ //es un registro nuevo
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.push({usuario_creo_id:accion.usuario})
          accion.set_id.push({alerta_id:accion.ref_id.alerta_id})
          accion.set_id.push({id:accion.ref_id.id})
          accion.set_id.map(object => 
            {   Object.entries(object).find(([key, value]) => {
                array[key] = value
            })
          })  
          let result:any
          result= await this._createDataAnyModel(null,'drsc_denuncia_persona',array)
          
          return result
        }
        else
        {
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.map(object => 
           {   Object.entries(object).find(([key, value]) => {
               array[key] = value
           })
         })  
         
         let result= await this._updateAnyModel('drsc_denuncia_persona', {where:accion.ref_id} ,array)
           return result

        }
      }  

     async actualizaPersonaAlerta(res,accion){
        let array:any={}
        console.log("actualiza persona",accion)
        if (accion.ref_id.id==null||accion.ref_id.id==0){ //es un registro nuevo
         
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.push({usuario_creo_id:accion.usuario})
          accion.set_id.push({alerta_id:accion.ref_id.alerta_id})
          accion.set_id.push({id:accion.ref_id.id})
          accion.set_id.map(object => 
            {   Object.entries(object).find(([key, value]) => {
                array[key] = value
            })
          })  
          let result:any
          console.log("entro a nuevo1",array)
          result= await this._createDataAnyModel(null,'drsc_alerta_persona',array)
          console.log("result",result)
          
          return result
        }
        else
        {
          
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          accion.set_id.map(object => 
           {   Object.entries(object).find(([key, value]) => {
               array[key] = value
           })
         })  
         console.log("actualiza else",accion,array)
         let result= await this._updateAnyModel('drsc_alerta_persona', {where:accion.ref_id} ,array)
         return result
        }
      }



     async actualizaDelito(res,accion){
      let array:any={}
      
         if (accion.ref_id.id==null||accion.ref_id.id==''){ 
              accion.set_id.push({usuario_actualizo_id:accion.usuario})
              accion.set_id.push({usuario_creo_id:accion.usuario})
              accion.set_id.push({alerta_id:accion.ref_id.alerta_id})
              accion.set_id.push({id:null})
              accion.set_id.map(object => 
                {   Object.entries(object).find(([key, value]) => {
                    array[key] = value
                })
              })  
              let result:any
          
              result= await this._createDataAnyModel(null,'drsc_diligenciamiento',array)
              return result

         }
         else{
             accion.set_id.push({usuario_actualizo_id:accion.usuario})
             accion.set_id.map(object => 
              {   Object.entries(object).find(([key, value]) => {
                  array[key] = value
              })
            })  
            
            let result= await this._updateAnyModel('drsc_diligenciamiento', {where:accion.ref_id} ,array)
              return result
         }
 

     }


      async BuscaActualizaAlerta(res,accion){
        let array:any={}
        let idKey:any={}
        let idKey2:any={}
        let bitacora:any[]=[]
 
         let alerta=await db["drsc_alerta"].findOne({where:{id:accion.ref_id['alerta_id']}}, { raw: true})
         let usuario=await db["mg_usuario"].findOne({where:{id:accion.usuario}}, { raw: true})
         
         if (alerta.dataValues){
          accion.set_id.map(object => 
            {   Object.entries(object).find(([key, value]) => {
                 array[key] = value
            })
          })  
          idKey['id']  =accion.ref_id['alerta_id'] 
          idKey2['alerta_id']=accion.ref_id['alerta_id'] 
          idKey2['eliminado']='N'

             let resultado= await this._updateAnyModel('drsc_alerta',{where:idKey},array)
            if (resultado.success){
                   
                     await this._updateAnyModel('drsc_buzon_x_alerta',{where:idKey2},{eliminado:'S',activo:'N'})
                    
                   if (resultado.data?.fieldToUpdate['admisibilidad_id']>=0){
                       let _nombreEstadoActual='' 
                      if (alerta.dataValues.admisibilidad_id){
                        let nombreEstadoActual=await db["drsc_cat_admisibilidad"].findOne({where:{id:alerta.dataValues.admisibilidad_id}}, { raw: true})
                        _nombreEstadoActual=nombreEstadoActual.dataValues.nombre
                       } 
                       
                      const nombreEstadoNuevo=await db["drsc_cat_admisibilidad"].findOne({where:{id:resultado.data?.fieldToUpdate['admisibilidad_id']}}, { raw: true})
                      
                      const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:2,nombre_operacion:'CAMBIO ADMISIBILIDAD',nombre_estado_actual:_nombreEstadoActual,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                      bitacora.push(resultCreate)
                      
                   }
                   if (resultado.data?.fieldToUpdate['estado']>=0){
                      let nombreEstadoActual=await db["drsc_cat_estatus_alerta"].findOne({where:{id:alerta.dataValues.estado}}, { raw: true})
                      let nombreEstadoNuevo=await db["drsc_cat_estatus_alerta"].findOne({where:{id:resultado.data?.fieldToUpdate['estado']}}, { raw: true})
                      const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:3,nombre_operacion:'CAMBIO ESTADO',nombre_estado_actual:nombreEstadoActual.dataValues.nombre,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                      bitacora.push(resultCreate)
                      
                   }
                   
                   if (resultado.data?.fieldToUpdate['entidad_alertada_id']>=0){
                        let nombreEstadoActual=await db["drsc_cat_institucion"].findOne({where:{id:alerta.dataValues.entidad_alertada_id}}, { raw: true})
                        let nombreEstadoNuevo=await db["drsc_cat_institucion"].findOne({where:{id:resultado.data?.fieldToUpdate['entidad_alertada_id']}}, { raw: true})
                        
                        const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:4,nombre_operacion:'CAMBIO ENTIDAD ALERTADA',nombre_estado_actual:nombreEstadoActual.dataValues.nombre,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                        bitacora.push(resultCreate)
                   } 

                   if (resultado.data?.fieldToUpdate['dependencia_alertada']){
                    const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:5,nombre_operacion:'CAMBIO DEPENDENCIA ALERTADA',nombre_estado_actual:alerta.dataValues.dependencia_alertada,nombre_nuevo_estado:resultado.data?.fieldToUpdate['dependencia_alertada'],usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                    bitacora.push(resultCreate)
               } 
            }
            
            return {resultado:resultado,bitacora:bitacora}
       }
        
   }
   
   async BuscaFinalizaAlerta(res,accion){
    let array:any={}
    let idKey:any={}
    let bitacora:any[]=[]
    let alerta=await db["drsc_alerta"].findOne({where:{id:accion.ref_id['alerta_id']}}, { raw: true})
    let usuario=await db["mg_usuario"].findOne({where:{id:accion.usuario}}, { raw: true})
     
     if (alerta.dataValues){
      accion.set_id.map(object => 
        {   Object.entries(object).find(([key, value]) => {
             array[key] = value
        })
      })  
      idKey['id']  =accion.ref_id['alerta_id'] 
         let resultado= await this._updateAnyModel('drsc_alerta',{where:idKey},array)
        if (resultado.success){
               if (resultado.data?.fieldToUpdate['admisibilidad_id']>=0){
                   let _nombreEstadoActual='' 
                  if (alerta.dataValues.admisibilidad_id){
                    let nombreEstadoActual=await db["drsc_cat_admisibilidad"].findOne({where:{id:alerta.dataValues.admisibilidad_id}}, { raw: true})
                    _nombreEstadoActual=nombreEstadoActual.dataValues.nombre
                   } 
                   
                  let nombreEstadoNuevo=await db["drsc_cat_admisibilidad"].findOne({where:{id:resultado.data?.fieldToUpdate['admisibilidad_id']}}, { raw: true})
                  const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:2,nombre_operacion:'CAMBIO ADMISIBILIDAD',nombre_estado_actual:_nombreEstadoActual,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                  bitacora.push(resultCreate)
               }
               if (resultado.data?.fieldToUpdate['estado']>=0){
                  let nombreEstadoActual=await db["drsc_cat_estatus_alerta"].findOne({where:{id:alerta.dataValues.estado}}, { raw: true})
                  let nombreEstadoNuevo=await db["drsc_cat_estatus_alerta"].findOne({where:{id:resultado.data?.fieldToUpdate['estado']}}, { raw: true})
                  const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:3,nombre_operacion:'CAMBIO ESTADO',nombre_estado_actual:nombreEstadoActual.dataValues.nombre,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                  bitacora.push(resultCreate)
               }
               if (resultado.data?.fieldToUpdate['entidad_alertada_id']>=0){
                    let nombreEstadoActual=await db["drsc_cat_institucion"].findOne({where:{id:alerta.dataValues.entidad_alertada_id}}, { raw: true})
                    let nombreEstadoNuevo=await db["drsc_cat_institucion"].findOne({where:{id:resultado.data?.fieldToUpdate['entidad_alertada_id']}}, { raw: true})
                    const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:3,nombre_operacion:'CAMBIO ENTIDAD ALERTADA',nombre_estado_actual:nombreEstadoActual.dataValues.nombre,nombre_nuevo_estado:nombreEstadoNuevo.dataValues.nombre,usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                    bitacora.push(resultCreate)
               } 

               if (resultado.data?.fieldToUpdate['dependencia_alertada']){
                const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:3,nombre_operacion:'CAMBIO DEPENDENCIA ALERTADA',nombre_estado_actual:alerta.dataValues.dependencia_alertada,nombre_nuevo_estado:resultado.data?.fieldToUpdate['dependencia_alertada'],usuario_creo_id:accion.usuario,alerta_id:accion.ref_id.alerta_id,usuario:usuario.dataValues.correo})
                bitacora.push(resultCreate)
           } 
        }
      
        return {resultado:resultado,bitacora:bitacora}
   }
    
}


      async BuscaActualizaActividad(res,accion){
        let array:any={}
        let idKey:any={}
        accion.set_id.push({usuario_actualizo_id:accion.usuario})
        
        let documento=await db["drsc_actividad_alerta"].findOne({where:{id:accion.ref_id['id']}}, { raw: true})
        
          if (documento.dataValues){
                      accion.set_id.map(object => 
                        {   Object.entries(object).find(([key, value]) => {
                             array[key] = value
                        })
                      })  
                      idKey['id']  =accion.ref_id['id'] 
                       let resultado= await this._updateAnyModel('drsc_actividad_alerta',{where:idKey},array)
                       
                       if (resultado.data?.fieldToUpdate.propietario_id){
                        let nombre=await db["mg_usuario"].findOne({where:{id:resultado.data?.fieldToUpdate.propietario_id}}, { individualHooks: true})
                         
                        resultado.data.fieldToUpdate["propietario"]=nombre.dataValues.nombre+' '+nombre.dataValues.primer_apellido
                        }
                        
                        if (resultado.data?.fieldToUpdate.estado_actividad_id){
                          let nombre=await db["drsc_cat_estado_actividad"].findOne({where:{id:resultado.data?.fieldToUpdate.estado_actividad_id}}, { individualHooks: true})
                          
                          resultado.data.fieldToUpdate["nombre_estado_actividad"]=nombre.dataValues.nombre
                          }
                        
                        if (resultado.data?.fieldToUpdate.tipo_actividad_id){
                          let nombre=await db["drsc_cat_tipo_actividad"].findOne({where:{id:resultado.data?.fieldToUpdate.tipo_actividad_id}}, { individualHooks: true})
                          resultado.data.fieldToUpdate["nombre_tipo_actividad"]=nombre.dataValues.nombre
                          }  
                      return resultado
          }
   }  


  async BuscaActualizaDocumento(res,accion){
        let array:any={}
        let idKey:any={}
        accion.set_id.push({usuario_actualizo_id:accion.usuario})
        let documento=await db["drsc_documento_alerta"].findOne({where:{id:accion.ref_id['id']}}, { raw: true})
          if (documento.dataValues){
                      accion.set_id.map(object => 
                        {   Object.entries(object).find(([key, value]) => {
                             array[key] = value
                        })
                      })  
                     
                      idKey['id']  =accion.ref_id['id'] 

                       let resultado= await this._updateAnyModel('drsc_documento_alerta',{where:idKey},array)
                      
                      if (resultado.data?.fieldToUpdate.tipo_documento_id){
                           let nombre=await db["drsc_cat_tipo_documento"].findOne({where:{id:resultado.data?.fieldToUpdate.tipo_documento_id}}, { individualHooks: true})
                           resultado.data.fieldToUpdate["nombre_tipo"]=nombre.dataValues.nombre
                      }
                      return resultado
          }
   }  

   async BuscaActualizaDocumentoImagen(res,accion){
    let array:any={}
    let idKey:any={}
    accion.set_id.push({usuario_actualizo_id:accion.usuario})
    let documento=await db["drsc_documento_alerta"].findOne({where:{id:accion.ref_id['id']}}, { raw: true})
      if (documento.dataValues){
                  accion.set_id.map(object => 
                    {   Object.entries(object).find(([key, value]) => {
                         array[key] = value
                    })
                  })  
                 
                  idKey['id']  =accion.ref_id['id'] 

                   let resultado= await this._updateAnyModel('drsc_documento_alerta',{where:idKey},array)
                  if (resultado.data?.fieldToUpdate.tipo_documento_id){
                       let nombre=await db["drsc_cat_tipo_documento"].findOne({where:{id:resultado.data?.fieldToUpdate.tipo_documento_id}}, { individualHooks: true})
                       
                       resultado.data.fieldToUpdate["nombre_tipo"]=nombre.dataValues.nombre
                  }
                  return resultado
      }
}  


async BuscaAgregaDocumentoImagen(res,accion){
  let array:any={}
          accion.set_id.push(accion.ref_id)
          accion.set_id.push({usuario_creo_id:accion.usuario})
          accion.set_id.push({usuario_actualizo_id:accion.usuario})
          
          accion.set_id.map(object => 
            {   Object.entries(object).find(([key, value]) => {
                array[key] = value
            })
          })  
          let resultado= await this._createDataAnyModel(null,'drsc_documento_alerta',array)
          let nombre=await db["drsc_cat_tipo_documento"].findOne({where:{id:resultado.data['tipo_documento_id']}}, { individualHooks: true})
          resultado.data["nombre_tipo"]=nombre.dataValues.nombre
          
          return res.status(200).send(resultado)
    }
 




  async BuscayActualizaEsadoAlerta(alerta:any[],usuarioTraslado:number,usuarioActualiza:number){
    let resultado:object[]=[]
    var _nuevoEstado
    var _correo
    var _nuevoEstadoNombre=''
    var nuevoEstado
        
       if (alerta && alerta.length>0)
         for (let i=0;i<alerta.length;i++){
            
           const alertaId=await db['drsc_alerta'].findOne({where:{id:alerta[i]["id"]}}, { individualHooks: true})
           const usuario=await db['mg_usuario'].findOne({where:{id:usuarioActualiza}}, { individualHooks: true})
           _correo=usuario.dataValues.correo
  
           
           const estado=await db["drsc_cat_estatus_alerta"].findOne({where:{id:alertaId.dataValues['estado']}}, { individualHooks: true})
           
           let r=new String(estado.dataValues['siguiente_estado'])
  
          /* if (r.indexOf(',')!==-1){
              let t1=await db["drsc_cat_estatus_alerta"].findOne({where:{id:estado.dataValues['siguiente_estado'],activo:'S',eliminado:'N'}}, { individualHooks: true})
              nuevoEstado=t1.dataValues.id
           }
           else
           {*/ 
               
               nuevoEstado=alerta[i].estado
             
           //}
           
           const buzon_id=await db["drsc_buzon_x_usuario"].findOne({where:{usuario_id:usuarioTraslado,activo:'S',eliminado:'N'}}, { individualHooks: true})
           const alerta_id=await db["drsc_buzon_x_alerta"].findOne({where:{alerta_id:alerta[i].id,activo:'S',eliminado:'N'}}, { individualHooks: true})
           
           
           if (!nuevoEstado||nuevoEstado==null) //temp{{
            {    _nuevoEstado=10
                 _nuevoEstadoNombre='ANALISIS'
           }   
           else   
               _nuevoEstado=nuevoEstado
          // resultado.push({alertaId:alertaId.dataValues.id,Estado:_nuevoEstado})
           
           
         //1 actualiza el nuevo estado de la alerta.
         
           const resultUpdate= await this._updateAnyModel('drsc_alerta',{where:{id: alertaId.dataValues.id}},{fecha_actualizado:  new Date(moment().tz("America/Guatemala").format()),estado:_nuevoEstado,usuario_actualizo_id:usuarioActualiza})           //2 inserta en la bitacora de cambios de estado, le asigna la operacion 1, cambio de estado.
              
             if (resultUpdate.success){
                       const resultCreate=await this._createDataAnyModel(null,'drsc_bt_estado_alerta',{operacion:1,nombre_operacion:'TRASLADO DE BUZON',nombre_estado_actual:estado.dataValues["nombre"],nombre_nuevo_estado:_nuevoEstadoNombre,usuario_creo_id:usuarioActualiza,alerta_id:alertaId.dataValues.id,nombre_alerta:alertaId.dataValues.comision+' '+alertaId.dataValues.anio +' '+alertaId.dataValues.correlativo,usuario:_correo })
                  if (!alerta_id ||!alerta_id.dataValues){
                       if (resultCreate.success){
                         const resultBuzon= await this._createDataAnyModel(null,'drsc_buzon_x_alerta',{buzon_id:buzon_id.dataValues.buzon_id,alerta_id:alertaId.dataValues.id,usuario_creo_id:usuarioActualiza})
                         resultado.push({alertaId:alertaId.dataValues.id,Estado:_nuevoEstado,operacion:'recepcion',buzon:null,usuarioTraslado:null}) // los parametros nulos se usan solo para el traslado entre buzones
                           if (resultBuzon.error&&resultBuzon.error!=null)
                                 return {success:false, data:null, error:"error al crear el buzon"}
                    }     
                    else   return {success:false, data:null, error:"error al crear la bitocara de drsc_bt_estado_alerta"}
                  }  else //actualiza el buzon, la alerta ya existe, 
                    {  
                     
                            const resultUpdate= await this._updateAnyModel('drsc_buzon_x_alerta',{where:{alerta_id: alerta_id.dataValues.alerta_id}},{fecha_actualizado: sequelize.literal('CURRENT_TIMESTAMP'),estado:nuevoEstado,usuario_actualizo_id:usuarioActualiza,buzon_id:buzon_id.dataValues.buzon_id})           //2 inserta en la bitacora de cambios de estado, le asigna la operacion 1, cambio de estado.
                            resultado.push({alertaId:alertaId.dataValues.id,Estado:_nuevoEstado,operacion:'traslado',buzon:buzon_id.dataValues.buzon_id,usuarioTraslado:usuarioTraslado})
                      
                    }
                   
             } 
             else   return {success:false, data:null, error:"error al actualizar el estado de la alerta drsc_bt_estado_alerta"}             
         }
         else{
          return {success:false, data:null, error:"no se remitió el listado de lertas"}      
         }
    
    return {success:true, data:resultado, error:null}
 }

 

  async _query(query){
  
  try {
     const [results] = await sequelize.query( query);
     return {success:true,error:null,data:results}
  }
  catch (error){
     return {success:false, error:error,data:null}
  }  
  }
  async _queryPagination(query,tamano:number ,pagina:number){
    try {
      
       var [results] = await sequelize.query( query, { 
        replacements: {
          tamano: tamano,
           pagina: pagina
        }
         }) 
       
       return {error:null,data:results}
    }
    catch (error){
       return {error:error,data:null}
    }  
    }
  
//filtros

isNumber(value?: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

parse(dominio,uid:string|null,dataToSearch:any){
  var clausula   : Array<any>
  var operadoriz : string
  var operador   : string=''
  var operadorder: string;
  var where      : string;
  var result     : Array<any>
  var result1    : string='';
  if (dominio){
  var tmp = dominio.substring(1,dominio.length-1)
  
  var array=tmp.split(')')
  
  result=array.map(item=>{
  
     item=item.replace('[','')
    let item2=item.replace(',(','')
    item2=item2.replace('(','')
    
    if (item2.length>0){
         clausula    = item2.split(',')
         operadoriz  = clausula[0].replace(/\s/g,'')
         operadoriz  = operadoriz.replace(/'/g,'')
         operadorder = clausula[2]
         operador    = clausula[1].replace(/'/g,'')
         operador    = operador.replace(/\s/g,'')
         where       = operadoriz
         
         let checkIn=operador.includes('in')
         let inicial=''
         if (checkIn){
            inicial=operador.replace('in','')
            operador='in'
          }  
         
     
      switch(operador){
        case '=': where=where + ' = ';break;
        case 'in': where=where+ ' IN(' 
                
                operadorder=''
               for (let i=2 ; i<clausula.length;i++){
               if (i==clausula.length-1)
                  operadorder= operadorder+clausula[i]
                else
                   operadorder= operadorder +clausula[i]+','
              }
              if (inicial.length>0)
                 operadorder=operadorder+','+inicial
              where=where+operadorder+')'
              break;   
     }   


     
     if (operador!='in')
      switch(operadorder){
         case 'uid' :     
                          if (typeof uid=='string')
                             uid="'"+uid+"'";
                             //si el operador derecho es string lo convierte en estring
                          
                          where =where + uid;
                         break;
         default: 
                      let data:any
                    
                       if (dataToSearch && Object.keys(dataToSearch).length>0){
                         let oper:string=operadorder.replace(/'/g, "")
                         data=dataToSearch[oper]
                       }  
                       else{
                          data=operadorder //si el parametero del dominio no es una variable, entonces se asume como una constante.
                        }  
                       
                        
                        if (operadoriz=="eliminado"){
                        data='N'
                        data="'"+data+"'";
                        }
                        else   
                          if (!this.isNumber(data) && (typeof data=='string' || typeof data==undefined)){
                            data="'"+data+"'";
                          }   
                       where=where +  data
                       break;
                       
       } 
      return where
   }
  })
     for (let i=0; i<result.length; i++){
       if (result[i]!=undefined){
           result1=result[i]
           
           if (result.length>i+1 && result[i+1]!=undefined)
           result1=result1+ ' and '
        }   
     }
     return result1
  }
  else
  return ''
}

parseJoin(join){

  var clausula   : Array<any>
  var operadoriz : string
  var operador   : string=''
  var operadorder: string;
  var where      : string;
  var result     : Array<any>
  var result1    : string='';

  
  var tmp = join.substring(1,join.length-1)
  
  var array=tmp.split(')')
  
  result=array.map(item=>{
    
    let item2=item.replace(',(','')
    item2=item2.replace('(','')
    item2=item2.replace('[','')
    if (item2.length>0){
         clausula    = item2.split(',')
         operadoriz  = clausula[0].replace(/\s/g,'')
         operadoriz  = operadoriz.replace(/'/g,'')
         operadorder = clausula[2]
         operadorder  = operadorder.replace(/'/g,'')
         operador    = clausula[1].replace(/'/g,'')
         operador    = operador.replace(/\s/g,'')
         where       = operadoriz

               
         let checkIn=operador.includes('in')
         let inicial=''
         if (checkIn){
            inicial=operador.replace('in','')
            operador='in'
          }  

      switch(operador){
        case '=': where=where + ' = ';break;
        case 'in': where=where+ ' IN(' 
                
                operadorder=''
               for (let i=2 ; i<clausula.length;i++){
               if (i==clausula.length-1)
                  operadorder= operadorder+clausula[i]
                else
                   operadorder= operadorder +clausula[i]+','
               
              }
              if (inicial.length>0)
                 operadorder=operadorder+','+inicial
              where=where+operadorder+')'
              break;   
      }
        
      if (operador!='in'){   
      switch(operadorder){
         default:      
                       where=where +  operadorder
                       break;
        } 
      
     } else operadorder=''
     return where
   }
  })
  result=result.filter(item=>item!=undefined)
  for (let i=0; i<result.length; i++){
    if (result[i]!=undefined){
        result1=result1+result[i]
        
        //if (result.length>i+1 && result[i+1]!=undefined)
        if (result.length>i+1)
        result1=result1+ ' and '
     }   
  }
  return result1
}

async parseDominio(dominio:string,uid:string,dataToSearch:any,parse_sjoin){
    var rdominio     : string
    var rjoin       : string  ='' 
    

    var rproyectionJoin:string
    console.log("data to search",dataToSearch,dominio,uid) 
    rdominio=this.parse(dominio,uid,dataToSearch)
    
    if (parse_sjoin){
      rjoin=this.parseJoin(parse_sjoin)
      
    }
    console.log("rdominio",rdominio,"separador",rjoin)
     if (rjoin)
      return rdominio+' and '+rjoin
     else     
       return rdominio
    //  return result
}
async validateUserGroup2(user:number,actionid:number,actionName:string){
  
  //console.log("usuario",user,actionid,actionName)  
  if (actionName&&actionName.length>0){
          const action=await this._query('SELECT id from mg_accion_forma where mg_accion_forma.nombre= "'+actionName+'"')
        
          if (action.success){
            let list=action.data.map(item=>item.id)
        
          const result =  await this._query("SELECT mg_grupo_x_usuario.grupo_id FROM mg_grupo_x_usuario,mg_grupo_x_accion_forma WHERE mg_grupo_x_accion_forma.grupo_id=mg_grupo_x_usuario.grupo_id and mg_grupo_x_usuario.activo='S' and usuario_id =" + user + " and mg_grupo_x_accion_forma.accion_forma_id in ("+ list+')')
  //        console.log("select","SELECT mg_grupo_x_usuario.grupo_id FROM mg_grupo_x_usuario,mg_grupo_x_accion_forma WHERE mg_grupo_x_accion_forma.grupo_id=mg_grupo_x_usuario.grupo_id and mg_grupo_x_usuario.activo='S' and usuario_id =" + user + " and mg_grupo_x_accion_forma.accion_forma_id in ("+ list+')')
//          console.log("result",result)
          return result
          }

  }
  else
  { 
    const result=await this._query("SELECT mg_grupo_x_usuario.grupo_id FROM mg_grupo_x_usuario,mg_grupo_x_accion_forma WHERE mg_grupo_x_accion_forma.grupo_id=mg_grupo_x_usuario.grupo_id and  mg_grupo_x_usuario.activo='S' and usuario_id =" + user + " and mg_grupo_x_accion_forma.accion_forma_id="+ actionid)
    console.log("result",result)
    return result
  }

}

 async validateAction(action:number,actionName:string,id){
  
  return  await this._query("SELECT mg_grupo_x_accion_forma.grupo_id,dominio_sjoin,sjoin,proyection_sjoin,mg_accion_forma.id,vista_id,nombre_desplegado,nombre,tipo_accion,vista_modo,respuesta_modelo,origen_modelo,vista_forma,dominio,modo,pagina,opciones_pagina,dominio_detalle FROM mg_accion_forma, mg_grupo_x_accion_forma,mg_grupo_x_usuario    WHERE  (mg_accion_forma.id = " + action +" or nombre=" +"'"+actionName+"'" + ") and mg_accion_forma.id=mg_grupo_x_accion_forma.accion_forma_id and mg_grupo_x_accion_forma.activo='S' and mg_grupo_x_accion_forma.eliminado='N' and mg_grupo_x_usuario.grupo_id=mg_grupo_x_accion_forma.grupo_id and mg_grupo_x_usuario.usuario_id="+id+ " and mg_grupo_x_usuario.activo='S'")
  
}
async orderByDeFault(fields:any){
  var concat=" ORDER BY "
  var concatField=''
  let fieldsOrder=fields.data.filter(item=> (item.order_by!=null && (item.order_by=='asc' || item.order_by=='dsc')))
      fieldsOrder.sort(function (a, b) {
        return a.order - b.order;
      })
      for (let i=0;i<fieldsOrder.length;i++){
        if (i<fieldsOrder.length-1)
              concatField=concatField+' '+fieldsOrder[i].nombre+' ' + fieldsOrder[i].order_by + ','
        else      
              concatField=concatField+' '+fieldsOrder[i].nombre+' ' + fieldsOrder[i].order_by
      }
       if (concatField)
       concat=concat+' '+concatField
       else concat=""
     return concat  
      
  }
  
  async crearSort(sort,fields:any){
   
    let filter=fields.data.filter(item=>item.nombre==sort.active)
      for (let i=0;i<filter.length;i++){
        if (filter[i].origen_campo=='A'){
             let _sort=''
             await fields.data.filter(item=>{
                      if (item.order % 1 !== 0){ //es decimal
                          let numero=item.order.split('.')
                             if (numero[0]==Number(filter[i].order)){
                                 if (_sort.length>0)
                                 _sort=_sort+','
                                _sort=_sort + ' '+item.nombre +' '+ sort.direction           
                             }   
                      }
           }) 
           _sort=' ORDER BY '+ _sort
          return _sort
         }  
        else
        {  
          return ' ORDER BY '+filter[i].nombre+ ' '+sort.direction
        }
     }
  
  }
  async getActionModel(model_id:number){
    return  await this._query("SELECT  * FROM mg_modelo WHERE  id="+model_id)
  }

  async  accessModel(model_id:number,group_id:number){
   
    let result= await this._query("SELECT mg_acceso_x_modelo.regla,mg_acceso_x_modelo.agrega,mg_acceso_x_modelo.lectura,mg_acceso_x_modelo.escritura,mg_acceso_x_modelo.elimina FROM mg_acceso_x_modelo WHERE grupo_id="+group_id+ " and modelo_id="+model_id)
    
    return result
 }
 
 /*async  getViewByAction(view_id:number){
      let result= await this._query("SELECT path,fullpath FROM mg_vista WHERE id="+view_id)
    return result
 }*/

async getDataModel(accessRegla:string|null,grupo_array,model_name:string,domain:string,vista_id:number,pagina:number,pageIdx:number,sort:any,sjoin:string|null,filtros:string,proyection_sjoin:string){
  
  var select:string="";
  var l_c_fields:any;
  var totalFilas:any
  var orderByDefault
  var operadorder:string=''
  var operador :string=''
  var operadoriz:string=''
  var array:number[]=[]
  const total=pagina*pageIdx
  var resultadoAccesoRegla:string=''
  

  for (let i=0;i<grupo_array.length;i++){
        array.push(grupo_array[i].grupo_id)
  }
  
  /*cambio delicado en b.activo=1 por b.activo='S'*/
  
  let p_modelo   = await this._query("SELECT id from mg_modelo WHERE  activo='S' and modelo="+ "'" +model_name+"'")

   l_c_fields = await this._query("SELECT distinct b.origen_campo,b.valor_defecto,field_id,b.nombre,b.index,b.sololectura,b.requerido,b.tamano,c.nombre  as tipo,d.campo_activo,d.order,d.visible,b.nombre_desplegado,  b.json,d.order_by from mg_grupo_x_modelo_atributo as a join mg_atributo_x_modelo as b,mg_atributo_tipo as c, mg_modelo_x_atributo_x_vista d  WHERE  b.tipo_campo=c.id and a.field_id=b.id and b.activo='S' and b.modelo_id = "+ p_modelo.data[0].id  + " and a.group_id IN("+ array+ ") and d.vista_id="+vista_id+" and d.modelo_x_atributo_id=b.id")
   console.log("lc_fields data model","SELECT distinct b.origen_campo,b.valor_defecto,field_id,b.nombre,b.index,b.sololectura,b.requerido,b.tamano,c.nombre  as tipo,d.campo_activo,d.order,d.visible,b.nombre_desplegado,  b.json,d.order_by from mg_grupo_x_modelo_atributo as a join mg_atributo_x_modelo as b,mg_atributo_tipo as c, mg_modelo_x_atributo_x_vista d  WHERE  b.tipo_campo=c.id and a.field_id=b.id and b.activo='S' and b.modelo_id = "+ p_modelo.data[0].id  + " and a.group_id IN("+ array+ ") and d.vista_id="+vista_id+" and d.modelo_x_atributo_id=b.id")
   //l_c_fields = await accesoModelo(l_c_fields)
   

  
  if (!sort || !sort.active)
   orderByDefault=await this.orderByDeFault(l_c_fields) 
  else
   orderByDefault=await this.crearSort(sort,l_c_fields) 

   let converter=l_c_fields.data.filter(x=>{if (x.origen_campo!='A') return x})
   for (let i=0;i<converter.length;i++ ){
      if (converter[i].nombre=='id'||converter[i].nombre=='activo')
      select = select + model_name+'.'+converter[i].nombre 
      else
     select = select + model_name+'.'+converter[i].nombre
     if (i<(converter.length-1))
        select+=","
 }
 
 if (proyection_sjoin && proyection_sjoin.length>0){
        select=select+","+proyection_sjoin
 }
 console.log("proyection_sjoin",select)

 //console.log("select",select)
 let smodel=""
 console.log("soin",sjoin,accessRegla)
 if (sjoin)
 
    if (sjoin && sjoin.length>0){

      let item2=sjoin.replace('[','')
      item2=item2.replace(']','') 
      if (item2)
       model_name=model_name+','+item2         
  }
 
 if (accessRegla && accessRegla.length>1) {
  let item2=accessRegla.replace('[','')
    item2=item2.replace(']','') 
    item2=item2.replace('(','') 
    let clausula    = item2.split(',')
    
    operadoriz  = clausula[0].replace(/\s/g,'')
    
    operadoriz  = operadoriz.replace(/'/g,'')
    operadoriz  = operadoriz.replace('(','') 
    
    operador    = clausula[1].replace(/'/g,'')
    operador    = operador.replace(/\s/g,'')
    let where       = operadoriz
    
    if (operador=='in'){
       operador=operador.toUpperCase()
       for (let i=2 ; i<clausula.length;i++){
        if (i==clausula.length-1)
        operadorder= operadorder+clausula[i]
        else
        operadorder= operadorder +clausula[i]+','

       //   console.log("clausualia i",i,clausula[i])
       }
      //operadorder=  
      if (domain)
      resultadoAccesoRegla=' and '+operadoriz+' '+operador+operadorder
     else
     resultadoAccesoRegla=' '+operadoriz+' '+operador+operadorder
    }
    
    
 }
  if (filtros) filtros=' and '+filtros
  
  if (domain&&domain!='empty' && domain!='All'){
     let data:any;
      
        data=  await this._queryPagination("SELECT distinct " + select+ " FROM "+  model_name+ " WHERE " +domain + resultadoAccesoRegla+' '+ filtros+ " "+orderByDefault + " LIMIT :tamano, :pagina",total,pagina ) 
        console.log("sql","SELECT distinct " + select+ " FROM "+  model_name+ " WHERE " +domain + resultadoAccesoRegla+ ' '+filtros)
      //  console.log(" result select  ",data.data)

         totalFilas= await this._query("SELECT distinct count(*) as total " + " FROM "+  model_name+ " WHERE " +domain+ resultadoAccesoRegla+' '+ filtros)
         console.log("total fileas",totalFilas)
        return {"data":data.data,"select":l_c_fields.data,totalFilas:totalFilas}     
  }
  else {
  
       let data=  await this._queryPagination("SELECT distinct " + select+ " FROM "+  model_name +' '+filtros+ " WHERE"+ " "+ orderByDefault  + " LIMIT :tamano, :pagina ", total,pagina)
       totalFilas= await this._query("SELECT distinct count(*) as total " + " FROM "+  model_name+ ' '+filtros)
       return {"data":data.data,"select":l_c_fields.data,totalFilas:totalFilas}      
       
  }
  
}


  async _filtro_de_datos(res,accion){
    let conditionWhere:string=''
    var operadorDer:string=''
    var dataToSearch = accion.dataToSearch
    console.log("acccion",accion)
        //1. buscar el nombre del modelo al que se la aplicara el filtro
        try {
      //  const modelo=await db["mg_modelo"].findOne({where:{id:accion.modelo_id,activo:'S',eliminado:'N'}}, { individualHooks: true})     
        
        for (let i=0;i<accion.filtros.length;i++){
          if (typeof accion.filtros[i].operadorDer=='string')
          operadorDer ="\'"+ accion.filtros[i].operadorDer+ "\'"
          conditionWhere= conditionWhere+' '+ accion.filtros[i].nombreOperadorIzq+ ' '+ accion.filtros[i].nombreOperador + ' '+operadorDer
          if (i+1<accion.filtros.length)
          conditionWhere= conditionWhere + ' and '
        }
           var resultGroup:any=await this.validateUserGroup2(accion.usuario,accion.accionForm,'')
               if (resultGroup.error==null && resultGroup.data && resultGroup.data.length>0){
                    const resultAction=await this.validateAction(accion.accionForm,"",accion.usuario)
                    const _resultAction =resultAction.data.shift()
                    
                    if (_resultAction && Object.keys(_resultAction).length>0){
                       console.log("result action",_resultAction)
                        const parseDominio  = await  this.parseDominio(_resultAction.dominio,accion.usuario,dataToSearch,_resultAction.dominio_sjoin)
                    
                        if (parseDominio){
                           const resultAccess  =(await this.accessModel(_resultAction.respuesta_modelo,resultGroup.data[0].grupo_id)).data[0]
                    
                                if (resultAccess){
                                      const resultModel=await this.getActionModel(_resultAction.respuesta_modelo)
                    
                                      if (resultModel){
                                          const _responseModel=resultModel.data.shift()
                                         
                                          const dataModel=await this.getDataModel(resultAccess.regla,resultGroup.data,_responseModel.modelo,parseDominio,_resultAction.vista_id,_resultAction.pagina,0,null,_resultAction.sjoin,conditionWhere,_resultAction.proyection_sjoin)
                                          
                                           if (dataModel){

                                            return {error:null,data:dataModel,filtros:accion.filtros}
                                           }
                                      }
                                      else
                                      {
                                        
                                        return res.status(200).json({success: false, data:null, errors: [{message:  "error revisar la parametrizacion de acceso al modelo"}]})          
                                      }
                                } 
                                else
                                {
                                  
                                  return res.status(200).json({success: false, data:null, errors: [{message:  "error revisar la parametrizacion de acceso al modelo"}]})        
                                }
                         }  
                         else
                         {
                          
                          return res.status(200).json({success: false, data:null, errors: [{message:  "error revisar el dominio asociado a la accion, la funcion de parseo no retorna valor"}]})
                         }
                    }   
                    else{
                        
                        return res.status(200).json({success: false, data:null, errors: [{message:  "error no existe accion relacionada revisar"}]})
                    }
                          

                return {error:null,data:null}
        }
      }
        catch (error){
          return {error:error,data:null}
    }
  }
}





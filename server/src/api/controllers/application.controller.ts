const _ = require('lodash')
import db from '../../db/models/index'
import {validationResult } from 'express-validator';
import { sequelize} from '../../config/connection'
import { errorHandler } from '../error/handler-error';
import { AppError,HttpCode } from '../error/app-error';




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
      console.log("error",error)
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

  
  
  _updateAnyModel(model:string,updateCondition:any,fieldToUpdate:any){
        return db[model].update(fieldToUpdate,updateCondition)
  }
    
  async _findOneAnyModel(model:string, condition:any) {
    try{
        return {success:true,data: await db[model].scope('withContrasena').findOne(condition)}
    }catch(error){
        return {success:false,data:null,error:error}
    }
}
   
async _findAllnyModel(model:string, condition:any) {
  try{
      return {success:true,data: await db[model].findAll(condition)}
  }catch(error){
      return {success:false,data:null,error:error}
  }
}

  async _createDataAnyModel(model:string,data:any){
    try{
     // data = _.cloneDeep(data)
    //  await sequelize.sync();
      return (await db[model].create(data)).get({plain:true})
    }catch(error){
      return error
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
  async _query(query){
  
  try {
     const [results] = await sequelize.query( query);
     return {error:null,data:results}
  }
  catch (error){
     return {error:error,data:null}
  }  
  }

  
  
}





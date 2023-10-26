import { ApplicationController } from './'
import { check,body,validationResult} from 'express-validator';
import {tokenController} from './tokenController'
import * as bcrypt from 'bcrypt'
/****types****/
import {mg_sesion_type} from "../../db/models/mg_session.model"
import {mg_usuario_type} from "../../db/models/mg_usuario.model"

import moment from 'moment-timezone';


export class SessionController extends ApplicationController {
  _tokenController:any
  
  constructor() {
    super('mg_sesion')
    
    this._tokenController=new tokenController() 
  }

  async createToken() {
      return await this._tokenController.createToken(this._tokenController.stringrandom())
  }

  async valsesion(req,res){
  
    const sesion=req.body.sesion.session
    if (sesion["ids"] &&sesion["ids"]!=null){
    const ids=sesion["ids"][0]
    if (ids){
    const token=sesion.entities[ids].token_id
    const numeroSesion=sesion.entities[ids].id
    const today=new Date(moment().tz("America/Guatemala").format()); 
    const tokenValido=await this._tokenController.decodeToken(token)

    /*validate database session*/
      let _result=await super._findAllAnyModel(res,'mg_sesion',{raw:true,where:{activo:1,id:numeroSesion}})
    if ( tokenValido){
               if (_result.success && _result.data.length>0){ //valida token y sesion.
                      const fechaExpiracion=new Date(_result.data[0].token_expired_at)
                      console.log("VALIDATION",today,fechaExpiracion)
                      if (fechaExpiracion>today){  
                          console.log("entro esta bien")
                         return res.status(200).json({success: true, data:null, errors:null,})  
                       }  
                       else return res.status(200).json({success: false, code:"TK004", errors: "el token no es valido, expiró"})       
                }else  return res.status(200).json({success: false, code:"TK005", errors: "No tiene sesion valida"})       
            } else return res.status(200).json({success: false, code:"TK002", errors: "el token no es valido, no existe"}) 
       } else return res.status(200).json({success: false, code:"TK00", errors: "la sesion que se recibio no es valida o no existe"}) 
     }
      
   } 
   
  
   async valToken(req,res,next){
    const key=req.headers.authorization.split(" ")
    const token=key[1]
    const tokenValido=await this._tokenController.decodeToken(token)
    if ( tokenValido){
       console.log("next")
       next()
    }   
    else return res.status(200).json({success: false, code:"token", errors: 'el token no es valido'})                 
      
   } 
   

  async signout(req, res) 
  {
    console.log("REQ SIG OUT",req.body)
    let _sessionId=req.body.session?.ids[0]
    
    try{
      let _userId=req.body.session.entities[_sessionId].user.id
      await super._updateAnyModel('mg_sesion',
      { 
       where: 
        {
            usuario_id: _userId,
            id:_sessionId
        }
      },
      { activo:0,
      })
         return res.status(200).json({success: true, data:null, errors:null,})
    }
     catch(error){
         console.log("error",error)
         return res.status(200).json({success: false, code:"DB001", errors: [error]}) 
    }    
    
  }  

  async cambiarStatusSesion(sesion:number){
    try{
      await super._updateAnyModel('mg_sesion',
      { 
       where: 
        {
            id: sesion
        }
      },
      { activo:0,
      })
        
    }
     catch(error){
         console.log("error online",error)
    }    
  }

    async onlineUser(req,res,id:number){
      try{
        await super._updateAnyModel('mg_usuario',
        { 
         where: 
          {
              id: id
          }
        },
        { status:'ONLINE',
        })
          
      }
       catch(error){
           console.log("error online",error)
      }    
    }

  async createSession(req,res,user:mg_usuario_type){
    let _session:mg_sesion_type
    let _token= await this.createToken()
    let _tokenResult=await _token.valor
   
        _session =
        { id :0,
          activo:true,
          usuario_id          : user.id,
          token_id         : _tokenResult,
          token_extended_at: _token.payload.iat,
          token_expired_at : _token.payload.exp
       }
     return  await this._createDataAnyModel(res,'mg_sesion',_session)
     
  }

  async signin(req, res) {
    
    let _user:any
    let _session:any
    let _grupo:any
    let _grupo_estado:any


    console.log("siging",req.body)      
    if (req.headers["accept-language"]&&res.getLocale()!==req.headers["accept-language"]){
      res.setLocale(req.headers["accept-language"])
    }  
    //console.log("req body",req.body)
    if (req.body.contrasena.length<6 )
      return  res.status(200).json({ success:false, data:null, errors: [{message:  "la contraseña debe al menos tener 6 caracteres"}] });
    if (!req.body.correo)
            return  res.status(200).json({ success:false, data:null, errors: [{message:  "el usuario no fue debidamente identificado, verifique el correo"}] });
            req.condition = { raw:true, where: {correo: req.body.correo, activo:'S'},attributes: ['correo','id','nombre','primer_apellido','segundo_apellido','avatar','contrasena']}
            
            _user=await super._findOneAnyModel('mg_usuario',req.condition)
            console.log("_user",_user)
            if (!_user ||(_user.data==null))
                 return  res.status(200).json({ success:false, data:null, errors: [{message:  "el usuario no existe o no se encuentra activo."}] });
                         req.condition = { raw:true, where: {usuario_id: _user.data.id, activo:'S'}}
                         _grupo=await super._findAllAnyModel(res,'mg_grupo_x_usuario',req.condition)
                         if (!_grupo)
                              return  res.status(200).json({ success:false, data:null, errors: [{message:  "el usuario no tiene permisos."}] });
                              _grupo_estado=await super._query("select mg_grupo_x_usuario.grupo_id,drsc_cat_estatus_alerta.nombre,drsc_cat_estatus_alerta.id,drsc_cat_estatus_alerta.siguiente_estado,drsc_cat_estatus_alerta.finalizado from mg_grupo_x_usuario ,mg_grupo_x_estado,drsc_cat_estatus_alerta  where usuario_id="+  _user.data.id +" and mg_grupo_x_usuario.activo='S' and mg_grupo_x_usuario.grupo_id=mg_grupo_x_estado.grupo_id  and mg_grupo_x_estado.estado_id=drsc_cat_estatus_alerta.id and drsc_cat_estatus_alerta.activo='S' and drsc_cat_estatus_alerta.eliminado='N' and mg_grupo_x_usuario.activo='S'")
                              if (_user.success && _user.data){ 
                                  bcrypt.compare(req.body.contrasena, _user.data.contrasena).then( async result=>{
                                  if (result) {
                                      const _result= await super._query("SELECT id,activo, usuario_id,token_id,token_extended_at,token_expired_at  FROM mg_sesion  WHERE activo=1 and usuario_id="+_user.data.id)
                                      _session=_result["data"]
                                      if (_result["error"]==null && (!_session || _session.length==0)){
                                          _user.data["status"]="ONLINE"
                                          let online=await this.onlineUser(req,res,_user.data.id) 
                                          let session=await this.createSession(req,res,_user.data)
                                              _user.data["contrasena"]=''
                                              session["user"]=_user.data
                                              session.data["user"]=_user.data//parche.
                                              session.data["grupo"]= _grupo_estado.data
                                              console.log("exito",session)
                                              if (session.success)
                                                  return res.status(200).json({success: true, data:session.data, errors:null})
                                              else
                                                   return  res.status(200).json({ success:false, data:null, errors: [{message:  "error al crear la seción."}] });
                                      } 
                                      else{  
                                          if (_result["error"]==null && _session){
                                            let session
                                                if (Array.isArray(_session)){
                                                  session=_session.shift()
                                                } 
                                                else 
                                                  session=_session 
                                                  await this.onlineUser(req,res,_user.data.id) 
                                                  _user.data["status"]="ONLINE"
                                                  session["user"]=_user.data
                                                  session["grupo"]= _grupo_estado.data
                                                return res.status(200).json({success: true, data:session, errors:null,})
                                          }else return res.status(200).json({success: false, data:_session ,code:"SVC003", errors: [{message:  res.__("SVCS003")}]})
                                        }
            }
            else{
             
               return res.status(200).json({success: false, code:"SVC001", errors: [{message:  res.__("SVCC001")}]})
               }
          }) 
    }  
    else{
      
       return res.status(200).json({success: false,code:"SVC001", errors: [{message:  res.__("SVCC001")}]})
    }   
    

  }
}

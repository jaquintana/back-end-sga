import { ApplicationController } from './'
import { check,body,validationResult} from 'express-validator';
import {tokenController} from './tokenController'
import * as bcrypt from 'bcrypt'
/****types****/
import {mg_sesion_type} from "../../db/models/mg_session.model"
import {mg_usuario_type} from "../../db/models/mg_usuario.model"

import moment from 'moment-timezone';
import { contrasena } from '../procedimientos';



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
     if (sesion["ids"]){
    const ids=sesion["ids"][0]
    const token=sesion.entities[ids].token_id
    const token_expired_at=sesion.entities[ids].token_expired_at
    const numeroSesion=sesion.entities[ids].id
    const today=moment().tz("America/Guatemala").format(); 
    const result=today>token_expired_at
     const tokenValido=await this._tokenController.decodeToken(token)
    console.log("tokenValido",tokenValido)
    if ( tokenValido){
           if (!result){
               if ( numeroSesion && numeroSesion>0) return res.status(200).json({success: true, data:null, errors:null,})
               else  return res.status(200).json({success: false, code:"TK003", errors: "No tiene numero de sesion"})       
           } 
          else{
            
            if ( numeroSesion && numeroSesion>0)  this.cambiarStatusSesion(numeroSesion)
            return res.status(200).json({success: false, code:"TK002", errors: "token vencido"}) 
          }  
    }   
    else
     return res.status(200).json({success: false, code:"TK001", errors: "token Invalido"}) 
   } else
      return res.status(200).json({success: false, code:"SCS001", errors: "verificar los datos de la sesion"}) 
     
    const fechayhora=new Date()
      
 //   if (fechayhora>sesion.token_expired_at){}

    
    
   
  }
  

  async signout(req, res) 
  {
    
    let _sessionId=req.body.session.ids[0]
    //let _userId=req.body.session.entities[_sessionId].user_id
    let _userId=req.body.session.entities[_sessionId].user.id
    console.log(" signout",     _sessionId,req.body.session.entities[_sessionId].user.id)
    try{
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

    async onlineUser(id:number){
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

  async createSession(user:mg_usuario_type){
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
       let result=await this._createDataAnyModel('mg_sesion',_session)
       console.log("result create session",result)
        return result
     
  }

  async signin(req, res) {
    
    let _user:any
    let _session:any

    

    
    if (req.headers["accept-language"]&&res.getLocale()!==req.headers["accept-language"]){
      res.setLocale(req.headers["accept-language"])
    }  
    
    if (req.body.contrasena.length<6 || req.body.contrasena.length>8 ){
      return  res.status(200).json({ success:false, data:null, errors: [{message:  "la contraseña debe al menos tener 6 caracteres"}] });
    }  
      
         req.condition = { raw:true, where: {correo: req.body.correo, activo:1}}

         _user=await super._findOneAnyModel('mg_usuario',req.condition)
                
       if (_user.success && _user.data){ 
           bcrypt.compare(req.body.contrasena, _user.data.contrasena).then( async result=>{
            console.log("la contrseña es correcta",result)
                if (result) {
                   const _result= await super._query("SELECT id,activo, usuario_id,token_id,token_extended_at,token_expired_at  FROM mg_sesion  WHERE activo=1 and usuario_id="+_user.data.id)
                   console.log("resutlado de la session, existe o no sesion abierta",_result)
                   _session=_result["data"]

                   if (_result["error"]==null && (!_session || _session.length==0)){
                                     _user.data["status"]="ONLINE"
                                     let online=await this.onlineUser(_user.data.id) 
                                     console.log("resultado online",online,_user)
                                     let session=await this.createSession(_user.data)
                                     console.log("return no hay session",session)
                                     session["user"]=_user.data
                                     return res.status(200).json({success: true, data:session, errors:null})
                   } 
                   else{  
                       if (_result["error"]==null && _session){
                        let session
                             if (Array.isArray(_session)){

                              session=_session.shift()
                             } 
                             else 
                              session=_session 
                              await this.onlineUser(_user.data.id) 
                              _user.data["status"]="ONLINE"
                              session["user"]=_user.data
                              console.log("return hay session",session)
                             return res.status(200).json({success: true, data:session, errors:null,})
                       }else
                       return res.status(200).json({success: false, data:_session ,code:"SVC003", errors: [{message:  res.__("SVCS003")}]})
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

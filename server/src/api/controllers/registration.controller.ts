import { ApplicationController } from './'
import { body} from 'express-validator';
import { bnc_mail_type} from '../types/mail_type'
import { tokenController } from './tokenController';
import { mailUser } from './mailUser.controller';
import {type_mail} from '../types/mail_type'

const _type_mail=type_mail

export class RegistrationController extends ApplicationController {
  
  constructor() {
    super('mg_usuario')
  }





async signup(req, res) {
    let active=false
    
    body('correo', 'Enter a valid email address.').isEmail().isLength({ min: 3 , max: 100 })
    body('nombre', 'First Name must be between 2 and 50 characters in length.').isLength({ min: 5 , max: 50 })
    body('primer_apellido', 'Last Name must be between 2 and 50 characters in length.').isLength({ min: 5 , max: 50 })
    body('segundo_apellido', 'Last Name must be between 2 and 50 characters in length.').isLength({ min: 0 , max: 50 })
    body('contrasena', 'Password should be at least 6 chars long.').isLength({ min: 6 })
    body('cui', 'Password should be at least 6 chars long.').isLength({ min: 10 })

    //
    req.body["institucion_id"]=1
    
          req.condition = {raw:true, where: {database_id: 1 }}
          req.pick = ['correo', 'nombre', 'primer_apellido', 'contrasena','institucion_id','cui','terminos']
          const result=super._create(req , res, {message: 'Congrats! You have successfully registered'})
            
       //let result= await super._query("SELECT mg_usuario.id FROM mg_institucion JOIN mg_usuario ON mg_institucion.id = mg_usuario.institucion_id")
       //req.pick = ['correo', 'nombre', 'primer_apellido','segundo_apellido', 'contrasena','cui',active]
      
       
      //if (result.error==null && result.data.length==1){
           
          /* let _bnc_mail:bnc_mail_type
           let _token=await new mailUser(req.body.email).sendConfirmationMail()
            
            console.log("return token",_token)
           _bnc_mail={
              active:true,
              id:0,
              token:"",
              email:req.body.email,
              type_mail:_type_mail,
              user_uid:result.data[0].id
            }
           await super._createDataAnyModel('bnc_mail',_bnc_mail)*/
      
     //  }
      
     return result
}

async confirmation(req,res){
  
   let confirmToken=new tokenController()
    confirmToken.returnToken(req.params.token).then(async result=>{
       if (result){       
        
        try{
         let _result=await super._findOneAnyModel('bnc_mail',{raw:true,where:{active:true}})
       
         if (_result.success && _result.data.user_uid>1){
           try{
              await super._updateAnyModel('sys_user',
                { 
                  where: 
                  {
                     id: _result.data['user_uid']
                  }
                },
                {
                  active:true,
                  status:'offline'
                },
          )
          try{
            await super._updateAnyModel('bnc_mail',
            { 
             where: 
              {
                  user_uid: _result.data['user_uid']
              }
            },
            {
                active:false,
            },
            )
            res.redirect('http://localhost:4500/sign-in')
          }catch(error){
              await super._createDataAnyModel('bnc_mail_error',{description:error,token:req.params.token}) 
          }            
         }catch(error){
               await super._createDataAnyModel('bnc_mail_error',{description:error,token:req.params.token}) 
         }
        }
        else{
           await super._createDataAnyModel('bnc_mail_error',{description:'not return result of bnc_mail model, already activate or not exist, Controller: confirmation line 56',token:req.params.token}) 
           res.status(400).send({success: false})
        }
       }catch(error){
            super._createDataAnyModel('bnc_mail_error',{description:error,token:req.params.token}) 
        }
      } else
      {
         super._createDataAnyModel('bnc_mail_error',{description:'not return result, return confirmToken.returnToken',token:req.params.token})
      }
    }).catch(error=> {
         super._createDataAnyModel('bnc_mail_error',{description:error,token:req.params.token})
    })
  }

}
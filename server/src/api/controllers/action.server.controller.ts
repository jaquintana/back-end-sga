import {BaseDeDatosController } from './basededatos.controller'
import * as Security from '../procedimientos'
import { action_server } from '../types/action_server_types'

export class ActionServerController extends BaseDeDatosController {
    
   private accion_server:action_server={
     usuario:0,
     modelo_id:0,
     ref_id:{},
     set_id:{}
   } 

    
    
    constructor(){
        super()
    }
    

    initAccionServer(){
    
    }
    async actionServer(req,res){
        console.log("action server")
        let userRequerid  =req.body.usuario
        let actionRequerid=req.body.id
        let resultGroup=await this._validateUserGroup(userRequerid)

        
        
        if (resultGroup.error==null && resultGroup.data && resultGroup.data.length>0){
            this.initAccionServer()
            this.accion_server.usuario=req.body.usuario
            this.accion_server.ref_id=req.body.ref_id
            this.accion_server.set_id=req.body.set_id
            let resultAction=await this._validateActionServer(actionRequerid)
                 if (resultAction.error==null && resultAction.data && resultAction.data.length>0)
                    if (resultGroup.data.length==1){
                         let _resultAction=resultAction.data.shift()
                         this.accion_server.modelo_id=_resultAction['modelo_id']
                         switch(_resultAction['tipo_accion_id']){

                            case 3:  console.log("xxxx")
                                     const controller=new Security[_resultAction['class']];   
                                     const _function=()=>controller[_resultAction['function']](res,this.accion_server)
                                     _function()
                                break;
                         }
                         
                                                    
                           //    return res.status(200).json({success: true, data:_resultAction, errors:null})
                          }
                  }     
                                     
  }      

}   
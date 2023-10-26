import {BaseDeDatosController } from './basededatos.controller'
import * as Security from '../procedimientos'
import * as Traslado from '../procedimientos'
import * as documento_x_alerta from '../procedimientos'
import { action_server } from '../types/action_server_types'



const path = require('path');
var fs = require('fs');

export class ActionServerController extends BaseDeDatosController {
    
   private accion_server:action_server={
     usuario:0,
     modelo_id:0,
     ref_id:{},
     set_id:{},
     accionForm:0,
     id:0,
     data:{},
     filtros:[],
     dataToSearch:{}
   } 

    constructor(){
        super()
    }

    initAccionServer(){
      this.accion_server.usuario=0
      this.accion_server.ref_id={}
      this.accion_server.set_id={}
      this.accion_server.id=0
      this.accion_server.accionForm=0
    }
    
    async actionServerImage(req,res){
        console.log("ACTION SERVER IMAGE")
    }  

    async actionServer(req,res){
        
        let userRequerid  =req.body.usuario
        let actionRequerid=req.body.id
        let resultGroup=await this._validateUserGroup(userRequerid)
        if (resultGroup.error==null && resultGroup.data && resultGroup.data.length>0){
            this.initAccionServer()
            this.accion_server.usuario=req.body.usuario
            this.accion_server.id=req.body.id
            this.accion_server.ref_id=req.body.ref_id
            this.accion_server.set_id=req.body.set_id
            this.accion_server.accionForm=req.body.accionForm
            this.accion_server.data=req.body.data
            this.accion_server.filtros=req.body.filtros
            this.accion_server.modelo_id=req.body.modelo_id
            this.accion_server.usuario=req.body.usuario
            this.accion_server.dataToSearch=req.body.dataToSearch
          
            let resultAction=await this._validateActionServer(actionRequerid)
                 
                 if (resultAction.error==null && resultAction.data && resultAction.data.length>0)
                    if (resultGroup.data.length>=1){
                         let _resultAction=resultAction.data.shift()
                         this.accion_server.modelo_id=_resultAction['modelo_id']
                         switch(_resultAction['tipo_accion_id']){
                            case 3:  console.log("xx",_resultAction,_resultAction['class'])
                                     const controller=new Traslado[_resultAction['class']];   
                                     const _function=()=>controller[_resultAction['function']](res,this.accion_server)
                                     _function()
                                     break;
                            case 4:          
                                     const controller2=new Security[_resultAction['class']];  
                                     const _function2=()=>controller2[_resultAction['function']](res,this.accion_server)
                                     _function2()

                            case 5:  const controller3=new documento_x_alerta[_resultAction['class']];   
                                     const _function3=()=>controller[_resultAction['function']](res,this.accion_server)
                                     _function3()
                            break;  

                                break; 
                         }
                         
                                                    
                          }
                  }     
           }                          
  }      

  

 

import { ApplicationController} from './'
import {DatabaseByName} from './'
import { cloneDeep } from "lodash";

export class DatabaseOperations extends ApplicationController{
  constructor(model){
      super(model)
  }
  
  updtModel(res,nameModel,whereOptions,fieldsToUpdate){
       return super._updateModel(res,nameModel,whereOptions,fieldsToUpdate)
  }
    //es igual a la anterior unicamente que retorna el valor, sin utilizar return al cliente
    updateManyModel(res,nameModel,whereOptions,fieldsToUpdate){
      return super._updateManyModel(res,nameModel,whereOptions,fieldsToUpdate)
   }



  findAllAnyModel(res,nameModel,whereOptions){
    return super._findAllAnyModel(res,nameModel,whereOptions)
  }

  insertInAnyModel(res: any, nameModel: any,data:any){
    return super._createDataAnyModel(res,nameModel,data)
  }

  createModel(res,fieldsToUpdate){
     return super._createModel(res,fieldsToUpdate)
  }
    //es igual a la anterior unicamente que retorna el valor, sin utilizar return al cliente
  createManyModel(res,nameModel,fieldsToInsert){
      return super._createManyModel(res,nameModel,fieldsToInsert)
  }
  createChildModel(res,fieldsToUpdate,model){
    return super._createChildModel(res,fieldsToUpdate,model)
  }
 
  async _setChangeModel(res,nameModel){
    await super.setChangeModel(res,nameModel)
}
}

export class DatabaseModelByName extends ApplicationController{
    constructor(model){
        super(model)
    }
    updtModel(res,nameModel,whereOptions,fieldsToUpdate){
         return super._updateModel(res,nameModel,whereOptions,fieldsToUpdate)
    }

    //es igual a la anterior unicamente que retorna el valor, sin utilizar return al cliente
    updateManyModel(res,nameModel,whereOptions,fieldsToUpdate){
      return super._updateManyModel(res,nameModel,whereOptions,fieldsToUpdate)
   }


    createModel(res,fieldsToInsert){
        return super._createModel(res,fieldsToInsert)
    }

     //es igual a la anterior unicamente que retorna el valor, sin utilizar return al cliente
     createManyModel(res,nameModel,fieldsToInsert){
      return super._createManyModel(res,nameModel,fieldsToInsert)
   }

    _setChangeModel(res,nameModel){
         
         super.setChangeModel(res,nameModel)
    }
  }



export class formsDatabaseController  {
    private dataBaseOperation

    constructor() {}
    async init(model){
        this.dataBaseOperation=new DatabaseOperations(model)
       
    }

    async  updtModel(req,res)
    {
        let arrayModels=req.body
        let array:any={}
        let actualiza:any={}
        
        this.init('mg_modelo')
        for (let i=0;i<arrayModels.length;i++){
              // const namemodel=await this.dataBaseOperation._setChangeModel(res,arrayModels[i].model)
              if (arrayModels[i].typeModel=='root'){
               const  whereOption={
                where:{id: Number(arrayModels[i].key)}
               } 
                arrayModels[i].change.map(object => 
                {   Object.entries(object).find(([key, value]) => {
                    array[key] = value
                 })
                })
               this.dataBaseOperation.updtModel(res,arrayModels[i].model,whereOption,array)
             }  
             else{     array={}
                      if (arrayModels[i].typeModel=='many2many'){
                        //let whereOptions:string=''
                      
                              for (let x=0;x<arrayModels[i].change.length;x++){ //recorre la tupla
                                for (const [key, value] of Object.entries(arrayModels[i].change[x])) {
//                                   console.log("arraykey",arrayModels[i].arrayKeys)
                                    if (arrayModels[i].arrayKeys.includes(key) ){
                                       array[key]=value
                                       
                                    }   
                                }
                                const  whereOption={
                                  raw:true,
                                  where:array
                                 } 
                               //1    buscar 
                                      const result=await this.dataBaseOperation.findAllAnyModel(res,arrayModels[i].model,whereOption)
                                      
                                   
                                    
                                      if (result.data.length>0){
                                           arrayModels[i].change[x].operacion=='I'?actualiza['activo']='S':actualiza['activo']='N'
                                           await this.dataBaseOperation.updateManyModel(res,arrayModels[i].model,whereOption,actualiza)
                                      }      
                                      else  
                                            if (arrayModels[i].change[x].operacion=='I'){  
                                              for (const [key, value] of Object.entries(arrayModels[i].change[x])) {
                                                  if (arrayModels[i].arrayKeys.includes(key) ){
                                                    actualiza[key]=value
                                                    
                                                  }  
                                              }  
                                              actualiza['activo']='S'
                                              await this.dataBaseOperation.createManyModel(res,arrayModels[i].model,actualiza)
                                            }


                                }
                              }
                              
                   }
             }
        }  
   

   async  inserDataModel(req,res)
   {
       let arrayModels=req.body
       let array:any={}
       let llavesPadre:any=[]
       let resultado:any;      
       this.init('mg_modelo')
       let order:any[]=[]
       const ascending=(a,b)=> a.order>b.order? 1:-1; 
       arrayModels.sort(ascending)
 
       for (let i=0;i<arrayModels.length;i++){
             if (arrayModels[i].typeModel=='root' && arrayModels[i].typeOperation=='nuevo'){  
               arrayModels[i].change.map(object => 
               {   Object.entries(object).find(([key, value]) => {
                   array[key] = value
                })
               })//temporal
                resultado=await this.dataBaseOperation.insertInAnyModel(res,arrayModels[i].model,array)
                if (resultado.error)
                return res.status(200).json(resultado)
                else{ 
                      
                      llavesPadre.push({padre:arrayModels[i].model,llave:array})
                      
                      arrayModels[i].key=resultado.data.id
                      arrayModels[i].change.push({"id":resultado.data.id})
                      arrayModels[i].change.push({"fecha_creado":resultado.data.fecha_creado})
                       let copy=cloneDeep(arrayModels[i].change)
                           arrayModels[i].change=await this.funcionSplice(copy,arrayModels[i],'contrasena')
                           copy=cloneDeep(arrayModels[i].change)  
                           arrayModels[i].change=await this.funcionSplice(copy,arrayModels[i],'nueva_contrasena')
                       }
             }
             else{
              array={}
                      if (arrayModels[i].typeModel=='many2many' && arrayModels[i].typeOperation=='nuevo'){
                        //let whereOptions:string=''
                                 
                                   arrayModels[i].key=resultado.data.id
                              for (let x=0;x<arrayModels[i].change.length;x++){ //recorre la tupla
                                for (const [key, value] of Object.entries(arrayModels[i].change[x])) {
//                                   
                                    if (arrayModels[i].arrayKeys.includes(key) ){
                                      if ( value===null  || value===undefined || value=='0')//no trae valor, se toma el id creado
                                      {
                                      array[key]=resultado.data.id
                                      arrayModels[i].change[x][key]=resultado.data.id
                                     
                                      }
                                      else
                                       array[key]=value
                                       //console.log(`${key}: ${value}`,array);
                                    }   
                                }
                                const  whereOption={
                                  raw:true,
                                  where:array
                                 } 
                                      const result=await this.dataBaseOperation.findAllAnyModel(res,arrayModels[i].model,whereOption)
                                  
                                            if (arrayModels[i].change[x].operacion=='I'){  
                                              array['activo']='S'
                                              let _result=await this.dataBaseOperation.createManyModel(res,arrayModels[i].model,array)
                                             
                                            }

                                }
                              }
                              else
                                {     array={}  
                                     if (arrayModels[i].typeOperation=='nuevomany2many'){
                                        
                                       
                                        arrayModels[i].padre.forEach(item=>{
                                             const result=arrayModels.find(item2=>item2.model==item.padre)
                                           if (result){
                                                array[item.llave]=result.key
                                            }
                                        })
                                        await this.dataBaseOperation.createManyModel(res,arrayModels[i].model,array)
                                     }

                              }
             }   

       }  
      //console.log("arrayModels",arrayModels)
      return res.status(200).json({success: true, data:arrayModels, errors:null})
  }

   async funcionSplice(copy,arrayModels,cadena){
    console.log("index of",copy.findIndex((e,index) => {
      Object.keys(e).forEach(_key=>{
       if (_key==cadena) { 
         arrayModels.change.splice(index,1)
        }
        else{

        } })    
      }) )
      return arrayModels.change
   }
   async createModel(req,res)
   {
       let arrayModels=req.body
       let array:any={}
     
       this.init('sys_model')
        for (let i=0;i<arrayModels.length;i++){
               await this.dataBaseOperation._setChangeModel(res,arrayModels[i].model)
               arrayModels[i].change.map(object => 
               {   Object.entries(object).find(([key, value]) => {
                   array[key] = value
                })
               })

     
         if (arrayModels[i].action.viewForm!='Child')      
               this.dataBaseOperation.createModel(res,array)
         else{ 
               this.dataBaseOperation.createChildModel(res,array,arrayModels.shift())
         }  
       }  
  }

  async insertDataAnyModel(req,res)
   {
       let arrayModels=req.body
       let array:any={}
     
       this.init('sys_model')
        for (let i=0;i<arrayModels.length;i++){
               await this.dataBaseOperation._setChangeModel(res,arrayModels[i].model)
               arrayModels[i].change.map(object => 
               {   Object.entries(object).find(([key, value]) => {
                   array[key] = value
                })
               })
               this.dataBaseOperation.insertDataAnyModel(res,array)
         
       }  
  }
   
  createChildModel(req,res)
  {

        let arrayModels=req.body
        let array:any={}
        
        this.init('sys_model')
          for (let i=0;i<arrayModels.length;i++){
                this.dataBaseOperation._setChangeModel(res,arrayModels[i].model)
                arrayModels[i].change.map(object => 
                {   Object.entries(object).find(([key, value]) => {
                    array[key] = value
                  })
                })
        
               this.dataBaseOperation.createChildModel(res,array,arrayModels.shift())
            
        }  
  }
 }
         
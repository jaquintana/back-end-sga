
import { ApplicationController} from './'
import {DatabaseByName} from './'

export class DatabaseOperations extends ApplicationController{
  constructor(model){
      super(model)
  }
  
  updtModel(res,nameModel,whereOptions,fieldsToUpdate){
       return super._updateModel(res,nameModel,whereOptions,fieldsToUpdate)
  }

  createModel(res,fieldsToUpdate){
     return super._createModel(res,fieldsToUpdate)
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
    createModel(res,fieldsToInsert){
        return super._createModel(res,fieldsToInsert)
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
        
        this.init('mg_modelo')
        console.log("req body update",arrayModels)
        for (let i=0;i<arrayModels.length;i++){
              // const namemodel=await this.dataBaseOperation._setChangeModel(res,arrayModels[i].model)
               const  whereOption={
                where:{id: Number(arrayModels[i].key)}
               } 
                arrayModels[i].change.map(object => 
                {   Object.entries(object).find(([key, value]) => {
                    array[key] = value
                 })
                })
                console.log("Array",arrayModels[i].model,whereOption,array)
          this.dataBaseOperation.updtModel(res,arrayModels[i].model,whereOption,array)
        }  
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
         
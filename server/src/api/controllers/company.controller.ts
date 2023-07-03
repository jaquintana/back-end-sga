
import { ApplicationController } from './'



export class CompanyController extends ApplicationController {
  
  constructor() {
    super('sys_company')
  }

  findAllCompanies(req,res){
     req.condition = {raw:true, where: {}}
     return super._findAll("SVCCS001","SVCCS001","SVCCS001",req , res, () => {
    })
    }
  }



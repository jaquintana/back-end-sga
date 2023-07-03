import { ApplicationController } from './'
import { tokenController } from './tokenController';
import { cloneDeep } from "lodash";
/*Types*/
import { responseActionMenu} from '../../db/models/ui_menu.mode'
import { responseActionUrl} from '../../db/models/sys_action_url.model'
import { responseActionForm,ChildrenListModelType,Field,Group } from '../../db/models/sys_action_form';
import { mg_acceso_x_modelo_interface } from '../../db/models/mg_acceso_x_modelo';
import { promisify } from 'util';
import * as Security from '../procedimientos/security/index'





const xml2js = require('xml2js');


export interface  item{
  type:string,
  idx:number,
  idxAncestor:number,
  datamodel:any
  level:number
  create:boolean
  children:item[]
  overlay:string,
  class:string
  id:string
  groups:any[]
}


interface node2{
  level:number,
  type:string;
  id:string,
  label:string,
  maxLengh:number,
  placeholder:string
  options:[]
  value:string
 // field:field[];
  model:string;
  class:string;
  children:[]
  group:[],
  required:boolean

}

export interface FuseNavigationItem
{
    id: number;
    title?: string;
    subtitle?: string;
    action?:string;
    typeAction?:string;
    src_action?:number;
    model_id?:number
    value?:string;
    name?:string;
    rootMenuId?:number;
    sub_titulo:string;
    type?:
  7      | 'aside'
        | 'basic'
        | 'collapsable'
        | 'divider'
        | 'group'
        | 'spacer';
    hidden?: (item: FuseNavigationItem) => boolean;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
    link?: string;
    externalLink?: boolean;
    target?:
        | '_blank'
        | '_self'
        | '_parent'
        | '_top'
        | string;
    exactMatch?: boolean;
    isActiveMatchOptions?: any;
    function?: (item: FuseNavigationItem) => void;
     classes?: {
        title?: string;
        subtitle?: string;
        icon?: string;
        wrapper?: string;
    };
    icon?: string;
    badge?: {
        title?: string;
        classes?: string;
    };
    children: FuseNavigationItem[];
    meta?: any;
}

export type FuseVerticalNavigationAppearance =
    | 'default'
    | 'compact'
    | 'dense'
    | 'thin';

export type FuseVerticalNavigationMode =
    | 'over'
    | 'side';

export type FuseVerticalNavigationPosition =
    | 'left'
    | 'right';



export class ActionMenuController extends ApplicationController {
  
  responseAction:responseActionMenu={
    menu:
    {
    display_name: "",
    name        : "",
    id          : 0,
    active      : false,
    child_id    : 0,   //m2o
    parent_id   : 0,
    model_id    : 0,
    action      : 0,
    order       : 0,
    description : "",
    type        : "none",

    }
    }
    
  constructor() {
    super('ui_menu')
  }
  private async validateUserGroup(user:number){
    return  await super._query("SELECT grupo_id FROM mg_grupo_x_usuario WHERE  activo=1 and usuario_id =" + user)

  }
  private async getMenuRootAction()
  {
    let prueba= await super._query("SELECT mg_menu.modelo_id,mg_menu.descripcion,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor,mg_menu.padre_id FROM mg_menu WHERE  mg_menu.activo=1 and mg_menu.padre_id is null")
    return prueba
  }

  private async getMenuRootModelAction(modelId:number)
  {
    let prueba= await super._query("SELECT ui_menu.model_id,ui_menu.descripcion,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor,mg_menu.padre_id FROM mg_menu WHERE  mg_menu.activo=1 and mg_menu.padre_id is null and model_id="+ modelId)
    return prueba
  }
  
  private async getMenuModel(model_id:number,action:number){
    
    let rr= await super._query("SELECT mg_menu.sub_titulo,mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor FROM mg_menu  where  mg_menu.modelo_origen = "+model_id + " and  mg_menu.activo=1 and padre_id is null")
         
         return rr
  }
  

  async existChildren(fatherMenuId){
    let childrens=await super._query("SELECT mg_menu.sub_titulo,mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor FROM mg_menu  where  mg_menu.activo=1  and padre_id="+fatherMenuId)
    if (childrens.data.length>0) 
     return true 
    else
     return false

  }
 
  
  private createNode(item:any){
       let Inode:FuseNavigationItem={
       id        : item.id,
       children  : [],
       title     : item.nombre_desplegado,
       subtitle  : "",
       typeAction: item.type_action,
       active    : true,
       disabled  : false,
       icon      : item.icon,
       model_id  : item.modelo_id,
       action    : item.accion,
       name      : item.nombre,
       value     : item.valor,
       type      : item.type,
       sub_titulo: item.sub_titulo
 
       }
      
       
      return Object.assign({},Inode)       

  }
  
 
  private async getChildMenu(fatherMenuId:number,_node: FuseNavigationItem){
       
      let siblings=await super._query("SELECT  distinct mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,mg_menu.accion,mg_menu.nombre_desplegado,icon,valor FROM mg_menu  WHERE  mg_menu.activo=1  and mg_menu.padre_id="+fatherMenuId)
      let i=0
      let node:FuseNavigationItem
             
             if (siblings.data)
              while (siblings.data.length>i){
                   node=this.createNode(siblings.data[i]) 
                    
                   if (await this.existChildren(node.id)){
                      _node.children.push(await this.getChildMenu(node.id,node))
                   }else{
                      _node.children.push(node)
                   }
                   i++
              }
       return _node
  }
  
  private async getMainModelMenu(model_id:number,action:number){
    let arrayMenu:FuseNavigationItem[]=[]
         let menuModel=await this.getMenuModel(model_id,action)
              
              if (Array.isArray(menuModel.data)){
                    for (let i=0;i< menuModel.data.length;i++ ) {
                        let x=this.createNode(menuModel.data[i])
                        let nodo =await this.getChildMenu(x.id,x)
                        arrayMenu.push(cloneDeep(nodo))
                    }
               }else{
                    if (menuModel.data){
                      let x=this.createNode(menuModel.data)
                      let nodo =await this.getChildMenu(x.id,x)
                      
                      arrayMenu.push(cloneDeep(nodo))

                    }

               }     
             
              let rootMenu=this.createNode({
                id        : action,
                children  : [],
                nombre_desplegado     : 'root',
                subtitle  : "",
                typeAction: "",
                active    : true,
                disabled  : false,
                icon      : "",
                modelo_id  : model_id,
                accion   : action,
                nombre      : "root",
                value     : 0,
                type      : 'root',
                sub_titulo: "root"
              })

              arrayMenu.forEach(item=>{
                rootMenu.children.push(item)
              })
             
              return rootMenu
  }
  

  
  async actionMenu(req,res){
    let _userRequerid=req.body.user_id
    let _actionNameRequerid=req.body.action
    let _modelId=0
    let _actionId=0
  
    
    let resultGroup=await this.validateUserGroup(_userRequerid)
         
        if (resultGroup.error==null && resultGroup.data )
        {
      
          if (_actionNameRequerid=="menu")
          {             const _rootMenu=await this.getMenuRootAction()
                        
                        return res.status(200).json({success: true, data:_rootMenu.data, errors:null})
          }
         if (_actionNameRequerid=="model")
         {
                       _modelId=req.body.modelId
                       _actionId=req.body.actionId
                       
                        const _result=await this.getMainModelMenu(_modelId,_actionId)
                        
                        return res.status(200).json({success: true, data2:_result, data:"", errors:null})
          }              
        }             
        else
            return res.status(200).json({success: false, code:"AURL002", errors: [{message:  res.__("AURL002")}]})
  }  
}


export class ActionUrlController extends ApplicationController {
  
  responseAction:responseActionUrl={
    action:{
      id          : 0,
      name        : "",
      display_name: "",
      url         : "",
      target      : "",
      type_action : "",
      parameter   : "",
      currentAction:0,
    },
    
  }

  constructor() {
  
    super('mg_accion_navegar')
    
  }
  private async validateUserGroup(user:number){
    return  await super._query("SELECT grupo_id FROM mg_grupo_x_usuario WHERE  activo=1 and usuario_id =" + user)

  }
  private async validateActionUrl(actionName:string){
    
    return  await super._query("SELECT id,target,url,parameter,tipo_accion,nombre FROM mg_accion_navegar WHERE  nombre =" + "'"+actionName+"'")
  }

  async actionUrl(req,res){
    let userRequerid=req.body.user_id
    let actionNameRequerid=req.body.action
   
    let resultGroup=await this.validateUserGroup(userRequerid)
          
        if (resultGroup.error==null && resultGroup.data){
              let resultAction=await this.validateActionUrl(actionNameRequerid)
              if (Array.isArray(resultAction.data))
                 resultAction.data=resultAction.data.shift()
                  
                  if (resultAction.error==null && resultAction.data){
                        this.responseAction.action.display_name  = "",
                        this.responseAction.action.id            = resultAction.data.id
                        this.responseAction.action.parameter     = resultAction.data.parameter
                        this.responseAction.action.url           = resultAction.data.url
                        this.responseAction.action.target        = resultAction.data.target
                        this.responseAction.action.name          = resultAction.data.nombre
                        this.responseAction.action.type_action   = resultAction.data.tipo_accion
                        this.responseAction.action.currentAction = resultAction.data.id
                        
                        return res.status(200).json({success: true, data:this.responseAction, errors:null})
                  }
                  else
                  {
                    return res.status(200).json({success: false, code:"AURL001", errors: [{message:  res.__("AURL001")}]})
                  }
        }
        else
        {
          return res.status(200).json({success: false, code:"AURL002", errors: [{message:  res.__("AURL002")}]})
        }  
  }  

}





export class ActionController extends ApplicationController {
  private level:number=0
  items          : item[]=[]
  private raiz
  private childrenListArray:ChildrenListModelType[]=[]
  private childrenListArray2:ChildrenListModelType[]=[]
  private childrenList:ChildrenListModelType={
    nameModel:"",
    id:"",
    type:"",
    foreignKey:[],
    data:[],
    nameColumns:{
      name:"",
      columns:[]
    },
    groups:[]  ,
    component:"",
    nivel:0,
    one2many:"",
    color:"",
    action:"",
    icon:"",
    datatype:"",
    idaction:"",
    children:[],
    idx:0,
    ancestor:0,
    required:false
  }
  
  

  private column={
     title:'',
     field:'',
     hozAlign:"center",
     sorter:"",
     type:'',
     datatype:'',
     sequence:-1,
 }

  private field={
    name:'',
    type:'',
    datatype:'',
    sequence:0,
    label:'',
    id:'',
    placeholder:'',
    maxlength:10

  }
  private initResponseActionForm():responseActionForm{
    return {
      id:0,
      model:"",
      fullname:"",
      display_name:"",
      action:{
        action      : "",
        viewMode    : [""],
        viewForm    : "",
        domain      : "",
        typeAction  : "",
        display_name: "",
        name        : "",
        src_model:0,
        res_model:0,
        mode:"" 
      },
      menu:[{}],
      data:[{}],
      model_fields:[{}],
      one2manydata:[{}],
      many2onedata:[{}],
      many2manydata:[{}],
      model_id:0,
      total_row_model:0,
      access:{},
      value:"",
      currentAction:0,
      view:[{}],
      field:[{}],
      nameModel:"",
      childrenList:[],
      childrenList2:[],
      fieldBreadCrumb:"",
      mode:'empty',
      pais:0,
      idioma:0,
      outlet:'',
      dataToSearch:null,
      parameter:[{}],
      extraData:[{}]
    }
  
  }

  constructor() {
    super('mg_accion_forma')
    
  }

  

private async validateUserGroup(user:number){
    return  await super._query("SELECT grupo_id FROM mg_grupo_x_usuario WHERE  activo=1 and usuario_id =" + user)

}

private async validateAction(action:number,actionName:string){
  return  await super._query("SELECT id,vista_id,nombre_desplegado,nombre,tipo_accion,vista_modo,respuesta_modelo,origen_modelo,vista_forma,dominio,modo FROM mg_accion_forma WHERE  id = " + action +" or nombre=" +"'"+actionName+"'" )
}


private async validateActionServer(action:number){
  return  await super._query("SELECT id,nombre,modelo_id,ref_id,tipo_accion_id,set_id FROM mg_accion_servidor WHERE  id =" + action)
}

private async validateGroupByView(group_id:number,ui_view:number){
  return  await super._query("SELECT count(*) as total FROM mg_grupo_x_vista WHERE grupo_id="+group_id+ " and vista_id =" + ui_view)
}
private async selectProceso(procesoId:number){
    return  await super._query("SELECT orden,id,nombre,nombre_desplegado  FROM pr_flujo_etapa WHERE eliminado='N' and activo='S' and id="+procesoId)

}

private async validateGroupByActionForm(action_id:number,group_id:number){
  return  await super._query("SELECT count(*) as total FROM mg_grupo_x_accion_forma WHERE  accion_forma_id="+action_id+ " and grupo_id =" + group_id)
}

private async validateActionByView(action_id:number,accion_name:string){
  let result
  
  if (action_id)
    result= await super._query("SELECT a.vista_id,b.tipo_vista,b.path,b.fullpath,b.outlet FROM mg_accion_forma_x_vista as a JOIN mg_vista as b WHERE a.accion_forma_id = "+action_id+ " and b.id=a.vista_id")
  else
    result= await super._query("SELECT a.vista_id,b.tipo_vista,b.path,b.fullpath,b.outlet FROM mg_accion_forma_x_vista as a JOIN mg_vista as b JOIN mg_accion_forma as  c WHERE c.nombre='"+ accion_name + "' and c.id=a.accion_forma_id  and b.id=a.vista_id")

  
  return result
}


private async getFieldByModel(model_id:number){
  
  return  await super._query("SELECT mg_atributo_x_modelo.*,mg_atributo_tipo.nombre as type FROM mg_atributo_x_modelo JOIN mg_atributo_tipo WHERE modelo_id = "+model_id+ " and mg_atributo_x_modelo.tipo_campo=mg_atributo_tipo.id")
}

private async getGeneral(base_de_datos:number){
  let result=  await super._query("SELECT pais_id,idioma_id FROM mg_configuracion_general  WHERE base_de_datos = "+base_de_datos)
  
  return result

}


async getDataModelCat(idModelo:number){
  var a
  const models  = await super._query("SELECT a.modelo,b.padre_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_one2many b where a.id=b.padre_id and b.modelo_id= "+ idModelo )
       a = models.data.map(async item=>{
        let data= await super._query("SELECT "+ item.contexto+ " from "+ item.modelo + " WHERE  activo='S' and eliminado='N'")
        item["data"]=data.data
       return item
   })
     return await Promise.all(a)
}

async getDataModelmany2one(idModelo:number,foreignKey:any){
  var a
  const models  = await super._query("SELECT a.modelo,b.modelo_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_many2one b where a.id=b.modelo_id and b.padre_id= "+ idModelo )
  console.log("id modelo many2one",idModelo,models)
       a = models.data.map(async item=>{
        let data= await super._query("SELECT "+ item.contexto+ " from "+ item.modelo + " WHERE  activo='S' and eliminado='N' and "+ item.llaveforanea+ "= '"+foreignKey+"'")
        console.log("data",data)
        item["data"]=data.data
       return item
   })
     return await Promise.all(a)
}

async extraData(vistaId:number){

  const modelos  = await super._query("SELECT  id,tipo,modelo_sql,modelo_id,contexto,dominio,nombre from mg_datos_modelo_x_vista where activo='S' and eliminado='N' and vista_id= "+ vistaId )
  let arrayResultado:any[]=[]
         for (let i=0;i<modelos.data.length; i++){
               const modelo=modelos.data[i]
               const resultado=await super._query(modelo.modelo_sql )
               arrayResultado.push(cloneDeep({modelo:modelos.data[i].nombre,data:resultado.data}))
               
               
         }
    
    return arrayResultado
}


async many2ManyData(idModelo:number,vista:number,dataToSearch:any){
     let arreglo:any[]=[]
      var modelo
      var modeloa
      var modeloc
      var llave
      var fila
      var llaveExtranjera

       
      //busco todas las tuplas que correspnden a ese modelo ya sea pivote izquierdo o derecho en many2many
      const modelos  = await super._query("SELECT  modelo_a_id,modelo_b_id,modelo_c_id,llave_modelo_a_id,llave_modelo_c_id,llave_modelo_b_id from  mg_many2many  where  modelo_a_id="+idModelo + ' or '+ "modelo_b_id="+idModelo )

      
     
      //filtra que existan camos  de la vista relacionados, que este en la vista, que sea forraneo en otro modelo, seran campos virtuales/ de lo contrario ya no proyecta nada.
      const campos  = await super._query("SELECT  b.id,b.nombre  from  mg_modelo_x_atributo_x_vista a JOIN mg_atributo_x_modelo b where b.campo_relacionado=1 and llave_foranea=2 and b.id=a.modelo_x_atributo_id and a.vista_id="+vista + " and a.activo='S' and a.eliminado='N' and b.activo='S' and b.eliminado='N'")
      

     
      //buscara todos los datosque corresponden a cada campo de la vista que representa una llave foranea.
      for (let i=0; i<campos.data.length;i++){
               //filtra aquellos modelos que tienen el campo que se desplegara en la viata (por ejemplo groupo_id de la tabla mg_usuario que se desplegara en la vista)
               modeloa=await modelos.data.find((item)=> item.llave_modelo_a_id==campos.data[i].nombre )
               modeloc=await modelos.data.find(item=>item.llave_modelo_c_id==campos.data[i].nombre )
                    llaveExtranjera=await modelos.data.map((item=>{if (item.modelo_a_id==idModelo) return item.llave_modelo_a_id} )).shift()
               if (!llaveExtranjera)
                   llaveExtranjera=await modelos.data.map(item=>{if (item.modelo_c_id==idModelo) return item.llave_modelo_c_id}).shift()
               
              
               if (modeloa){
                     modelo =await super._query("select nombre from mg_modelo where id="+modeloa['modelo_a_id'])
                     llave=modeloa.llave_modelo_a_id
                     fila=modeloa
                 }    
                if (modeloc){
                     modelo =await super._query("select nombre from mg_modelo where id="+modeloc['modelo_c_id'])
                     llave=modeloc.llave_modelo_c_id
                     fila=modeloc
                  }   
                 else 
                   return
                   //obtiene la data que correponde a la tabla de muchos a muchos
                   
                   const modeloPivote =await super._query("select nombre from mg_modelo where id="+fila.modelo_b_id)
                
                   const data=await super._query("select nombre from " +modelo['data'][0].nombre +" as a JOIN "+ modeloPivote.data[0].nombre + " as b where a.activo=1 and b."+llaveExtranjera+"=a.id and b.id="+dataToSearch.id)
                
                       arreglo.push({"campo":campos.data[i].nombre,data:data['data']})
                      
       }
         return arreglo

}


private async getActionModel(model_id:number){
  return  await super._query("SELECT  * FROM mg_modelo WHERE  id="+model_id)
}

private async getMenuModel(model_id:number){
  return  await super._query("SELECT padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor,type_action FROM mg_menu JOIN sys_action ON  mg_menu.modelo_id="+model_id+ " and mg_menu.activo=1 and mg_menu.accion=sys_action.id")
}

private async getComponentView(extern_id:string){
  return  await super._query("SELECT name,fullpath FROM  ui_type_object_view  WHERE extern_id="+"'"+extern_id+"'")

}


private async  accessModel(model_id:number,group_id:number){
  let result= await super._query("SELECT mg_acceso_x_modelo.agrega,mg_acceso_x_modelo.lectura,mg_acceso_x_modelo.escritura,mg_acceso_x_modelo.elimina FROM mg_acceso_x_modelo WHERE grupo_id="+group_id+ " and modelo_id="+model_id)

   return result
}

private async  getViewByAction(view_id:number){
     let result= await super._query("SELECT path,fullpath FROM mg_vista WHERE id="+view_id)
   return result
}


private async getDataModel(grupo_id,model_name:string,domain:string,vista_id:number){
  
  var select:string="";
  var l_c_fields:any;
  //let p_grupo    = await super._query("SELECT count(*) from mg_grupo WHERE activo=1 and id=" +grupo_id)
  let p_modelo   = await super._query("SELECT id from mg_modelo WHERE  activo=1 and modelo="+ "'" +model_name+"'")
  
  l_c_fields = await super._query("SELECT b.origen_campo,field_id,b.nombre,b.index,b.sololectura,b.requerido,c.nombre  as tipo,d.campo_activo, b.json from mg_grupo_x_modelo_atributo as a join mg_atributo_x_modelo as b,mg_atributo_tipo as c, mg_modelo_x_atributo_x_vista d  WHERE  b.tipo_campo=c.id and a.field_id=b.id and b.activo=1 and b.modelo_id = "+ p_modelo.data[0].id  + " and a.group_id="+ grupo_id+ " and d.vista_id="+vista_id+" and d.modelo_x_atributo_id=b.id")
  
  
 
 for (let i=0;i<l_c_fields.data.length;i++ ){
   if(l_c_fields.data[i].origen_campo!='A'){
     select = select + l_c_fields.data[i].nombre
     if (l_c_fields.data.length>i+1 && l_c_fields.data[i+1].origen_campo!='A')
         select+=","
   }      
 }
  if (domain&&domain!='empty'){
     let data:any;
        data=  await super._query("SELECT " + select+ " FROM "+  model_name+ " WHERE " +domain ) 
      return {"data":data.data,"select":l_c_fields.data}     
  }
  else {
     
       let data=  await super._query("SELECT " + select+ " FROM "+  model_name )
       
       return {"data":data,"select":l_c_fields.data}      
       
  }
}



private async getEnumModelData(modelName:string,field:string){
    const firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
    const result=await super._query(firstDomain)
    const secondDomain="SELECT enumfield FROM sys_model_enum WHERE model="+result.data[0].id + " and namefield ="+"'"+field+"'"
    return await super._query(secondDomain)   
}



private async getDataModelFieldByName(modelName:string,columns:any,responseAction:responseActionForm)  {

  let _columns=columns["columns"]
  let firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
  let result=await super._query(firstDomain)
  
  let one2many="SELECT foreignKey_id FROM sys_one2many WHERE children_id="+ "'"+result.data[0].id+"'"
  let foreignKey=await super._query(one2many)
  
  let seconDomain=""
  let arrayColumns=""
  let condition=""
  
  for (let i=0;i<_columns.length;i++){
      i<_columns.length-1?arrayColumns= arrayColumns +_columns[i].field+',':arrayColumns=arrayColumns+ _columns[i].field
   }
       seconDomain='SELECT '+ arrayColumns + ' FROM sys_model_field' + ' WHERE' 
       condition=foreignKey.data[0].foreignKey_id+" = "+ result.data[0].id
       seconDomain= seconDomain+" "+ condition
       
       result=await super._query(seconDomain)
       return result.data
  }

  private async getDataModelFieldByName2(modelName:string,columns:any,responseAction:any)  {
    
    
    let _columns=columns["columns"]
    let one2many="SELECT foreignKey_id FROM sys_one2many WHERE children_id="+ responseAction.res_model+ ' and father_id=' + responseAction.src_model
    let foreignKey=await super._query(one2many)
    let firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
    let result=await super._query(firstDomain)
    
    let seconDomain=""
    let arrayColumns=""
    let condition=""
 

    for (let i=0;i<_columns.length;i++){
        i<_columns.length-1?arrayColumns= arrayColumns +_columns[i].field+',':arrayColumns=arrayColumns+ _columns[i].field
     }
     
         seconDomain='SELECT '+ arrayColumns + ' FROM sys_model_field' + ' WHERE' 
         if (foreignKey.data.length==0){
          condition='model_id'+" = "+ result.data[0].id
         }else
         condition=foreignKey.data[0].foreignKey_id+" = "+ result.data[0].id
         seconDomain= seconDomain+" "+ condition
         result=await super._query(seconDomain)
         
         return result.data
    }

  private async getSelectDataModelFieldByName(modelName:string,columns:any)  {

    let _columns=columns["columns"]
    const firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
    const result=await super._query(firstDomain)

    let seconDomain=""
    let arrayColumns=""
    for (let i=0;i<_columns.length;i++){
        i<_columns.length-1?arrayColumns= arrayColumns +_columns[i].field+',':arrayColumns=arrayColumns+ _columns[i].field
     }
         seconDomain='SELECT '+ arrayColumns + ' FROM '+ result['data'][0].model 
         seconDomain= seconDomain
         const result2= await super._query(seconDomain)
         return result2.data
         
    }

private async getDataModelByName(modelName:string,foreignKey:string,columns:any)  {
  let _columns=columns["columns"]
  let firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
  let result=await super._query(firstDomain)
  let seconDomain=""
  let arrayColumns=""
  let condition=""
  
   
 
  for (let i=0;i<_columns.length;i++){
      
      i<_columns.length-1?arrayColumns= arrayColumns +_columns[i].field+',':arrayColumns=arrayColumns+ _columns[i].field
   }
    
      seconDomain="SELECT " + seconDomain+" "+arrayColumns + ' FROM ' + result.data[0].model + ' WHERE' 
      
 // for (let i=0;i<foreignKey.length;i++){
        condition=foreignKey+" = "+ result.data[0].id
  // }
  seconDomain= seconDomain+" "+ condition
  result=await super._query(seconDomain)
  return result.data
  
}

private async getDataModelById(modelName:string,foreignKey:string,columns:any,id:number)  {
  
  let _columns=columns["columns"]
  let firstDomain= "SELECT model,id FROM sys_model WHERE name="+ "'"+modelName+"'"
  let result=await super._query(firstDomain)
  let secondDomain=""
  let arrayColumns="id,"
  let condition=""
  
  for (let i=0;i<_columns.length;i++){
      i<_columns.length-1?arrayColumns= arrayColumns +_columns[i].field+',':arrayColumns=arrayColumns+ _columns[i].field
   }
      secondDomain="SELECT " + secondDomain+" "+arrayColumns + ' FROM ' + result.data[0].model + ' WHERE' 
     
  //for (let i=0;i<foreignKey.length;i++){
        condition=condition+foreignKey+" = "+ id
   //}

  secondDomain= secondDomain+" "+ condition
  
  result=await super._query(secondDomain)
  
    return result.data

}


async getDataChildFormById(req,res,resp){
   let childrenList=req.body
   try{ 
        for (let i=0;i<childrenList.length;i++){
             
              if (childrenList[i].one2many.length>0 && childrenList[i].foreignKey.length>0){
                      const r=await this.getDataModelById(childrenList[i].nameModel,childrenList[i].foreignKey,childrenList[i].columns,childrenList[i].id)
                             
                             childrenList[i]['data']=  [...r]      
              }
        }
         return res.status(200).json({success: true, data:childrenList, errors:null})
    }
    catch(error){
         return res.status(200).json({success: false, code:"AURL002", errors: [{message:  res.__("AURL002")}]})
  }
}

  
private async getCountRowDataModel(model_name:string){
  let result=  await super._query("SELECT count(*) as total FROM " + model_name)
  
  return result
 } 


 async dataList(req,res){
   
  
  let userRequerid=req.body.user_id;
  let model=req.body.model;
  let domain=req.body.domain;
  let context=req.body.context


  let resultGroup=await this.validateUserGroup(userRequerid)
           if (resultGroup.error==null && resultGroup.data && resultGroup.data.length>0){
               let resultData=await super.xfindAll(model,domain,context)
           
                 return res.status(200).json({success: true, data:resultData, errors:null})
           }  
 }


    
 

 async addDataModel(list:any,idx,ancestor){
  let childrenList:ChildrenListModelType={
    nameModel:"",
    id:"",
    type:"",
    foreignKey:[],
    data:[],
    nameColumns:{
      name:"",
      columns:[]
    },
    groups:[]  ,
    component:"",
    nivel:0,
    one2many:"",
    color:"",
    action:"",
    icon:"",
    datatype:"",
    idaction:"",
    children:[],
    idx:0,
    ancestor:0,
    required:false
  }
   
   
   if (Array.isArray(list)){
    
   for (let i=0;i<list.length;i++){
       
         for (let prop in list[i]){
           switch (prop){
              case '$':     let property= list[i][prop]
                               
                                for (let prop in property){
                                  switch (prop){
                                            case 'type':    
                                                    if (property[prop]!='childtable') return null;
                                                      childrenList.type=property[prop]
                                                      
                                                  break;
                                            case 'name':      
                                                    childrenList.nameColumns?.name ?? property[prop]
                                                    break;
                                            case 'required':      
                                                    childrenList.required=property[prop]
                                            break;        
                                                    
                                            case 'model':
                                                    childrenList.nameModel=property[prop]
                                                    break;
                                            case 'id':
                                                    
                                                    childrenList.id=property[prop]
                                                    break;        
                                            case 'keyfield':
                                                        let array=property[prop].split(',')
                                                        childrenList.foreignKey=array
                                                    break;
                                            case 'one2many':
                                                      childrenList.one2many=property[prop]    
                                                  break;   
                                            case 'color':
                                                    childrenList.color=property[prop]    
                                                    break;               
                                            case 'icon':
                                                    childrenList.icon=property[prop]    
                                                    break;                                  
                                            case 'action':
                                                    childrenList.action=property[prop]    
                                                    break;
                                            case 'idaction':
                                                    childrenList.idaction=property[prop]    
                                                    break;                                              
                                            case 'datatype':
                                                    if (property[prop]=='tablebasic'){
                                                          const component=await this.getComponentView(property[prop])
                                                          childrenList.component=component.data.shift().name
                                                     }
                                                     if (property[prop]=='groupbasic'){
                                                      const component=await this.getComponentView(property[prop])
                                                      childrenList.component=component.data.shift().name
                                                     } 
                                                    break; 
                                  }
                            }  

              case 'field': let fields=list[i][prop] 
                            for (let i=0; i<fields.length;i++){
                              for (let prop in fields[i].$){
                                switch (prop){
                                        case 'name': this.column.field=fields[i].$[prop];break;
                                       // case 'required': this.column.required=fields[i].$[prop];break;
                                        case        'type': this.column.type         = fields[i].$[prop];break;
                                        case        'datatype': this.column.datatype = fields[i].$[prop];break;
                                        case        'sequence': this.column.sequence = fields[i].$[prop];break;
                                        case        'title': this.column.title       = fields[i].$[prop];break;
                                        case        'width': this.column['width']    = fields[i].$[prop];break;
                                        this.column['width']                         = fields[i].$[prop];break;
                                }    
                            }
                              childrenList.nameColumns?.columns.push(cloneDeep(this.column))
                              this.column={
                                title:'',
                                field:'',
                                hozAlign:"center",
                                sorter:"",
                                type:'',
                                datatype:'',
                                sequence:-1,
                            }
                          }
                          break
              }
        }
         
      }
    childrenList.idx=idx
    childrenList.ancestor=ancestor
 
    this.childrenListArray.push(cloneDeep(childrenList))
    
  }
  else
  {
          

          let findNode=this.childrenListArray.find(item=>item.nameModel==list.name)
          
          if (!findNode)
          {    
               childrenList.idaction=list.idaction
               childrenList.nameModel=list.name
               childrenList.type=list.type
               childrenList.id=list.id
               childrenList.color=list.color
               childrenList.icon=list.icon
               childrenList.action=list.action
               childrenList.datatype=list.datatype
               childrenList.required=list.required
               childrenList.nameColumns.name=""   
               childrenList.nameColumns.columns=[]
               const component=await this.getComponentView(list.datatype)
               childrenList.component=component.data.shift().name
               childrenList.idx=idx
               childrenList.ancestor=ancestor
 
               this.childrenListArray.push(Object.assign({},childrenList))
               
          }
  }
 }

 

 
  async addGroupDataModel(group:any,childrenlist:ChildrenListModelType,responseAction:responseActionForm){
       
    let _fields
    let conditions
   
    let _group:Group={
        namegroup:"",
        html:"",
        fields:[],
        type:"",
        component:""
    } 
     
      if (childrenlist.datatype=="formbasic"){
           
          _fields=await this.getDataModelFieldByName2(childrenlist.nameModel,{columns:[{field:'required'},{field:'readonly'},{field:'name'},{field:'id'},{field:'fkey'}]},responseAction)
        
      }   
      else 
          return    
       
      for (let i=0;i<group.length;i++){
        
         for (let prop in group[i]){
             switch(prop){
                case '$':
                  _group.namegroup=group[i][prop].name
                  _group.type=group[i][prop].type
                  _group.fields=[]
                  break;
                case 'field':
                          let _field:Field={
                            name       : "",
                            type       : "",
                            datatype   : "",
                            sequence   : 0,
                            id         : "",
                            label      : "",
                            placeholder: "",
                            maxlength  : 10,
                            required   : false,
                            readonly   : false,
                            index      : false,
                            disabled   : false,
                            options    : [],
                            fkey       : false
                          }
                      let fields=group[i][prop]
                     
                      for (let x=0;x<fields.length;x++){
                          
                         _field.name        = fields[x]['$'].name
                         _field.type        = fields[x]['$'].type.toUpperCase()
                         _field.datatype    = fields[x]['$'].datatype
                         _field.sequence    = x
                         _field.id          = fields[x]['$'].id
                         _field.label       = fields[x]['$'].label
                         _field.placeholder = fields[x]['$'].placeholder
                         _field.maxlength   = fields[x]['$'].maxlength?Number(fields[x]['$'].maxlength):20
                         _field.disabled    = false
                         _field.required    = false
                         _field.readonly    = false
                         if (_fields && _fields.length>0){
                         conditions=(_fields.filter(item=>item.name==_field.name)).shift()
                         
                         }
                          
                          if (conditions){
                              
                            _field.required=conditions.required==1?true:false
                            _field.readonly=conditions.readonly==1?true:false
                            _field.index=false 
                            _field.fkey=conditions.fkey
                          }
                         
                          if (_field.type=="SELECT"){
                            let resultObject={}
                              
                              if (!fields[x]['$'].one2many || ( fields[x]['$'].one2many && fields[x]['$'].one2many.length<=0)){ //is enum select
                              const result=await this.getEnumModelData(childrenlist.nameModel,_field.name)
                              const array=result?.data[0].enumfield.split(',')
                              
                              array.forEach(element => {
                                    resultObject['label']=element
                                    resultObject['value']=element
                                    resultObject?_field.options.push(cloneDeep(resultObject)):null
                              });  
                            }
                            else{
                                let arrayObject: any[]=[]
                                let arrayfields=fields[x]['$'].columns.split(',')
                                    arrayfields.forEach(element=>{
                                      resultObject['field']=element
                                      arrayObject.push(cloneDeep(resultObject))
                                    })
                              const _fields=await this.getSelectDataModelFieldByName(fields[x]['$'].one2many,{columns:arrayObject})
                              arrayObject=[]
                                  _fields.forEach(element=>{
                                    resultObject['label']=element.name
                                    resultObject['value']=element.id
                                    resultObject?_field.options.push(cloneDeep(resultObject)):null
                                  })
                            }
                         }  
                         _group.fields.push(Object.assign({},_field))
                      }
               break;
             }
            } 
            childrenlist.groups?.push(Object.assign({},_group))
      }
  }


  clearChildList(){
               this.childrenList.nameModel=""
               this.childrenList.type=""
               this.childrenList.id=""
               this.childrenList.nameColumns.columns=[]
               this.childrenList.nameColumns?.name??""
               this.childrenList.component=""
  }



  async parseJson(node:ChildrenListModelType,raiz:any,nivel:number,idx:number,_ancestor:number,responseAction:responseActionForm){

    for (let prop in raiz) {
       
      switch (prop){
        case '$':    break;
        case 'view': 
                     await this.parseJson(node,raiz.view,nivel+1,idx,_ancestor,responseAction)
                     break;
        case 'div':   
                      for (let i=0;i<raiz.div.length;i++){
                       await this.parseJson(node,raiz.div[i],nivel,idx,_ancestor,responseAction)
                      }
                      break;
                     
        case 'form':  
                    nivel+1
                    _ancestor=idx
                    idx++
                    
                     for (let i=0;i<raiz.form.length;i++){
                          await this.clearChildList()
                          await this.addDataModel(raiz.form[i]['$'],idx,_ancestor)
                          await this.parseJson(node,raiz.form[i],nivel,idx,_ancestor,responseAction)
                     }
                     break;
        case 'group': 
                     _ancestor=idx
                      idx++
                      
                      await this.addGroupDataModel(raiz['group'],this.childrenListArray[this.childrenListArray.length-1],responseAction) 
                       if (this.childrenListArray[this.childrenListArray.length-1].type!="formgroup"){
                            
                       //    await this.addDataModel(raiz.group[0]['$'],idx,_ancestor)
                       }
                        await this.parseJson(node,raiz.group[0],nivel,idx,_ancestor,responseAction)            
                     break;
        case 'tabgroup':
                    nivel+1
                    _ancestor=idx
                    idx++
                    
                     await this.addDataModel(raiz.tabgroup[0]['$'],idx,_ancestor)
                     await  this.parseJson(node,raiz.tabgroup[0],nivel,idx,_ancestor,responseAction)  //new tabgroup add one deep nivel           
                     break;
        case 'tab':  
                      for (let i=0;i<raiz.tab.length;i++){
                         await this.parseJson(node,raiz.tab[i],nivel,idx,_ancestor,responseAction)            
                      } 
                     break; 
        case 'list':  
                     nivel+1
                      _ancestor=idx
                      idx++
                      
                      this.childrenList.nameColumns?.columns ?? []
                      await this.addDataModel(raiz.list,idx,_ancestor) 

                      //this.parseJson(raiz.list[0],raiz.list,nivel)            
                      break;   
        case 'button':
                      nivel++
                      _ancestor=idx
                      idx++
                      this.childrenList.nameColumns?.columns ?? []
                      await this.addDataModel(raiz.button[0]['$'],idx,_ancestor) 
                      break;   
        }   
    }                
  }   
 transformXml(xml:any){
    let result
    const parser = new xml2js.Parser({ strict: false, trim: true,explicitChildren: true,preserveChildrenOrder:true, explicitArray: true   });
    parser.parseString(xml, (err, parse) => {
          result=parse

     });
     return result
}

createNode2():node2{
  return {
         level:0,
         type:"",
         id:"",
         label:"",
         maxLengh:0,
         placeholder:"",
         options:[],
         group:[],
         value:"",
         model:"",
         class:"",
         children:[],
         required:false

  }
}


async parseJSON2(json:any,node2:any){
  let i=0;
  var _temp
  var objeto:any
  var xobject:any
   if (json)
   for (let x=0;x<json.length;x++){
      for (let prop in json[x]) {

          switch (prop){
            case  '$':   
                        objeto=json[x][prop]
                       _temp=cloneDeep(this.createNode2())
                            _temp.level=this.level
                            if (json[x]["#name"]=='FIELD')
                              _temp.type=objeto.TYPE ||""
                            else
                            _temp.type        = json[x]["#name"]
                            _temp.id          = objeto.ID ||""
                            _temp.label       = objeto.LABEL ||""
                            _temp.name        = objeto.NAME ||""
                            _temp.class       = objeto.CLASS ||""
                            _temp.style       = objeto.STYLE ||""
                            _temp.icon        = objeto.ICON ||""
                            _temp.color       = objeto.COLOR ||""
                            _temp.action      = objeto.ACTION ||""
                            _temp.model       = objeto.MODEL||""
                            _temp.one2many    = objeto.ONE2MANY||""
                            _temp.idaction    = objeto.IDACTION||""
                            _temp.placeholder = objeto.PLACEHOLDER||""
                            _temp.required    = objeto.REQUIRED||false
                            if (objeto['DATATYPE']){
                              _temp.datatype=objeto.DATATYPE ||""
                               if (objeto['DATATYPE']=='tablebasic'||objeto['DATATYPE']=='groupbasic' || objeto['DATATYPE']=='formbasic'|| objeto['DATATYPE']=='tabgroupbasic'){
                                    const component= await this.getComponentView(objeto['DATATYPE'])
                                    _temp.component=component.data.shift().name
                                }
                            }
                            if (objeto['KEYFIELD']){
                              let array=objeto['KEYFIELD'].split(',')
                              _temp.foreignKey=array
                            }
                            node2.children.push(_temp)
                       break;
            case '$$':   
                         await this.parseJSON2(json[x][prop],_temp)  
                       break;
            case 'VIEW':  
                          xobject=json[x][prop]
                          this.level=this.level+1 
                          node2.level=this.level
                          node2.name='VIEW'
                          node2.html='<div> \n'
                          node2.type='VIEW'
                          node2.class=xobject.$.CLASS
                          node2.id=xobject.$.ID
                          await this.parseJSON2(xobject.$$,node2)     
                    break;     
                      }  
                 }    
              }
}     

async processChildrenModelXml(view:any,responseAction:responseActionForm){
  let _node:ChildrenListModelType= {
    type:"",
    nameModel:"",
    id:"",
    foreignKey:[],
    data:null,
    nameColumns:{
      name:"",
      columns:[]
    },
    groups:[], 
    component:"",
    one2many:"",
    nivel:0,
    action:"",
    color:"",
    datatype:"",
    icon:"",
    idaction:"",
    children:[],
    idx:0,
    ancestor:0,
    required:false
  }

  
   const parser2=new xml2js.Parser()
  
 
    for (let i=0; i<view.data.length; i++){
         this.childrenListArray=[]  
         this.items=[]
         if (view.data[i].view && view.data[i]){
              const result= await promisify(parser2.parseString)(view.data[i].view);
              const result2=await this.transformXml(view.data[i].view)
            
                 this.raiz= Object.assign({},this.createNode2())
                await this.parseJson(_node,result,0,0,0,responseAction)
                let array:any[]=[]
                array.push(JSON.parse(JSON.stringify(result2)))
                await this.parseJSON2(array,this.raiz) 
                await this.generateTemplate(this.raiz,0,this.items,0,0,0)
                
             
            }
    }
   
}

async generateTemplate(raiz:any,level,flatItems:item[],idx,idxAncestor,position:number){
  let _items
  let _field:Field={
    name:"",
    type:"",
    datatype:"",
    sequence:0,
    id:"",
    label:"",
    placeholder:"",
    maxlength:10,
    required:false,
    readonly:false,
    index:false,
    disabled:false,
    options:[],
    fkey:false
  }

 
  for (let prop in raiz) {
        switch (prop){
        case 'type':
               
                switch (raiz[prop]){
                   case 'VIEW':
                               _items={ 
                                        type:'VIEW',
                                        idx:idx,
                                        datamodel:"",
                                        level:level,
                                        children:[],
                                        idxAncestor:idxAncestor,
                                        html:"",
                                        created:false,
                                        overlay:raiz['id']?raiz['id']:"",
                                        label:raiz['label']?raiz['label']:"",
                                        class:raiz['class'].split(' '),
                                        position:position
                                 }
                                  if (raiz['children']&&raiz['children'].length>0){
                                           for (let x=0;x<raiz['children'].length;x++){
                                                  this.generateTemplate(raiz['children'][x],level,flatItems,idx,idxAncestor,0)
                                              }    
                                   }
                      position++                 
                      break;

                      case 'DIV':
                                _items={ 
                                            type:'DIV',
                                            idx:idx,
                                            id:raiz['id']?raiz['id']:"",
                                            datamodel:"",
                                            level:level,
                                            children:[],
                                            idxAncestor:idxAncestor,
                                            html:"",
                                            created:false,
                                            overlay:raiz['id']?raiz['id']:"",
                                            label:raiz['label']?raiz['label']:"",
                                            class:raiz['class'].split(' '),
                                            style:raiz['style'].split(' '),
                                            position:position
                                  }
                                   
                                            if (raiz['children']&&raiz['children'].length>0){
                                                      for (let x=0;x<raiz['children'].length;x++){
                                                          this.generateTemplate(raiz['children'][x],level,flatItems,idx,idxAncestor,0)
                                                      }    
                                          }
                                          else{
                                          
                                          }
                                  position++        
                                  break;
   
                      case 'FORM':    
                                        _items=cloneDeep({ 
                                           type:'formgroup',
                                           idx:idx,
                                           datamodel:"",
                                           level:level,
                                           children:[],
                                           idxAncestor:idxAncestor,
                                           html:"",
                                           created:false,
                                           overlay:raiz['id']?raiz['id']:"",
                                           class:raiz['class'].split(' '),
                                           label:raiz['label']?raiz['label']:"",
                                           id:raiz['id']?raiz['id'].substring(1):"",
                                           position:position,
                                           nameModel:raiz['model']?raiz['model']:"",
                                           foreignkey:raiz['foreignkey']?raiz['foreignkey']:"",
                                           component:raiz['component']?raiz['component']:"",
                                           datatype:raiz['datatype']?raiz['datatype']:"",
                                           one2many:raiz['one2many']?raiz['one2many']:"",
                                           groups:[]
                                         })
                                           flatItems.push(cloneDeep(_items))
                                               if (raiz['children'] && raiz['children'].length>0){
                                                  level++
                                                  idxAncestor=idx
                                                  for (let x=0;x<raiz['children'].length;x++){
                                                    idx++
                                                    this.generateTemplate(raiz['children'][x],level,flatItems,idx,idxAncestor,0)
                                                  }        
                                                }   
                                             
                                    position++    
                                    break;   

                     case 'TABGROUP':
                                     
                                     
                                    _items=cloneDeep({ 
                                            type:'tabgroup',
                                            idx:idx,
                                            datamodel:"",
                                            level:level,
                                            children:[],
                                            idxAncestor:idxAncestor,
                                            html:"",
                                            created:false,
                                            overlay:raiz['id']?raiz['id']:"",
                                            class:raiz['class'].split(' '),
                                            label:raiz['label']?raiz['label']:"",
                                            id:raiz['id']?raiz['id'].substring(1):"",
                                            position:position,
                                            nameModel:raiz['name']?raiz['name']:"",
                                            foreignkey:raiz['foreignkey']?raiz['foreignkey']:"",
                                            component:raiz['component']?raiz['component']:"",
                                            datatype:raiz['datatype']?raiz['datatype']:"",
                                            one2many:raiz['one2many']?raiz['one2many']:"",
                                            groups:[]
                                        })
                                        flatItems.push(_items)
                                        if (raiz['children'] && raiz['children'].length>0){
                                              level++
                                              idxAncestor=idx
                                            for (let x=0;x<raiz['children'].length;x++){
                                              idx++    
                                              this.generateTemplate(raiz['children'][x],level,flatItems,idx,idxAncestor,0)
                                            }  
                                        }
                                      
                          position++              
                          break;
                     case 'TAB':     
                                    
                                      _items=cloneDeep({ 
                                            type:'tab',
                                            idx:idx,
                                            datamodel:"",
                                            label:raiz['label']?raiz['label']:"",
                                            level:level,
                                            children:[],
                                            idxAncestor:idxAncestor,
                                            html:"",
                                            created:false,
                                            overlay:"",
                                            class:raiz['class'].split(' '),
                                            id:raiz['id']?raiz['id']:"",
                                            position:position,
                                            nameModel:raiz['name']?raiz['name']:"",
                                            groups:[]
                                        })
                                        if (raiz['children'] && raiz['children'].length>0){
                                            for (let x=0;x<raiz['children'].length;x++){
                                                  this.generateTemplate(raiz['children'][x],level,flatItems,idx++,idxAncestor,0)
                                            } 
                                        }
                                      
                           position++      
                           break;     
                      case 'LIST':
                                     
                                    _items=cloneDeep({ 
                                          type:'table',
                                          idx:idx,
                                          datamodel:"",
                                          level:level,
                                          children:[],
                                          idxAncestor:idxAncestor,
                                          html:"",
                                          created:false,
                                          overlay:raiz['id']?raiz['id']:"",
                                          class:raiz['class'].split(' '),
                                          id:raiz['id']?raiz['id'].substring(1):"",
                                          position:position,
                                          nameModel:raiz['model']?raiz['model']:raiz['name'],
                                          foreignkey:raiz['foreignKey']?raiz['foreignKey']:"",
                                          component:raiz['component']?raiz['component']:"",
                                          datatype:raiz['datatype']?raiz['datatype']:"",
                                          one2many:raiz['one2many']?raiz['one2many']:"",
                                          groups:[]
                                      })
                                        
                                        flatItems.push(_items)
                                        idxAncestor=idx
                                        if (raiz['children'] && raiz['children'].length>0){
                                            level++
                                
                                            for (let x=0;x<raiz['children'].length;x++){
                                              idx++
                                                  this.generateTemplate(raiz['children'][x],level,flatItems,idx+1,idx,0)
                                            }     
                                        }
                           position++             
                           break;        
                           
                           case 'BUTTON':
                    
                            _items=cloneDeep({ 
                                  type       : 'button',
                                  idx        : idx,
                                  datamodel  : "",
                                  level      : level,
                                  children   : [],
                                  idxAncestor: idxAncestor,
                                  html       : "",
                                  created    : false,
                                  overlay    : raiz['id']?raiz['id']                : "",
                                  class      : raiz['class'].split(' '),
                                  id         : raiz['id']?raiz['id']                : "",
                                  position   : position,
                                  icon       : raiz['icon']?raiz['icon']            : "",
                                  color      : raiz['color']?raiz['color']          : "",
                                  action     : raiz['action']?raiz['action']        : "",
                                  name       : raiz['name']?raiz['name']            : "",
                                  datatype   : raiz['datatype']?raiz['datatype']    : "",
                                  nameModel  : raiz['name']?raiz['name']            : "",
                                  foreignkey : raiz['foreignkey']?raiz['foreignkey']: "",
                                  component  : raiz['component']?raiz['component']  : "",
                                  one2many   : raiz['one2many']?raiz['one2many']    : "",
                              })
                              
                                flatItems.push(_items)
                                idxAncestor=idx
                                if (raiz['children'] && raiz['children'].length>0){
                                    level++
                                    for (let x=0;x<raiz['children'].length;x++){
                                      idx++
                                          this.generateTemplate(raiz['children'][x],level,flatItems,idx+1,idx,0)
                                    }     
                                }
                   position++             
                   break;        
                     case 'GROUP':
                                   
                                  _items=cloneDeep({ 
                                          type:'group',
                                          idx:idx,
                                          datamodel:"",
                                          level:level,
                                          idxAncestor:idxAncestor,
                                          html:"",
                                          created:false,
                                          overlay:"",
                                          position:position,
                                          name:raiz.name,
                                          datatype:raiz.datatype,
                                          fields:[],
                                          class:raiz.class,
                                          id:raiz['id']?raiz['id']:"",
                                          component:raiz['component']?raiz['component']:"",
                                          nameModel:raiz.model,

                                    })
                          
                                     if (raiz.children.length>0){
                                          for (let i=0;i<raiz.children.length;i++){
                                            _field.name=raiz.children[i].name
                                            _field.type=raiz.children[i].type.toUpperCase()
                                            _field.datatype=raiz.children[i].datatype
                                            _field.sequence=i
                                            _field.id=raiz.children[i].id
                                            _field.label=raiz.children[i].label
                                            _field.placeholder=raiz.children[i].placeholder
                                            _field.maxlength=raiz.children[i].maxlength?raiz.children[i].maxlength:10 
                                            _field.required=raiz.required=="true"?true:false
                                          
                                            _items.fields.push(cloneDeep(_field))
                                          }
                                     }   

                                     let node=flatItems.find(item=>item.idx==idxAncestor)
                                   
                                     if (node)
                                       node.groups.push(_items)
                                     if (raiz.datatype=="groupbasic")
                                       flatItems.push(_items)
                               
                           position++    
                           break;
                }
            break;         
       }  
     
  }
}


parseOutlet(outlet,parameter){

let str=outlet
let result1:string=''
  for ( let k in parameter){
       var reg = new RegExp(k, "gi");
       let _str:string=parameter[k].toString()
       result1=str.replace(reg,parameter[k]); 
  }
    return JSON.parse(result1)
}

async parseDominio(dominio:string,uid:string,dataToSearch:any){

  var tmp = dominio.substring(1,dominio.length-1)
  var array=tmp.split(')')
  var clausula   : Array<any>
  var operadoriz : string
  var operador   : string=''
  var operadorder: string;
  var where      : string;
  var result     : Array<any>
  var result1    : string='';
  
  
  
 result=array.map(item=>{
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
       switch(operador){
         case '=': where=where + ' = ';break;
       }
       

       switch(operadorder){
          case 'uid' :     
                           if (typeof uid=='string')
                              uid="'"+uid+"'";
                              //si el operador derecho es string lo convierte en estring
                           where =where + uid;
                          break;
          default: 
                       
                        let data=dataToSearch[operadorder]
                        if (typeof data=='string')
                             data="'"+data+"'";
                        where=where +  data
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

   seleccionarProceso(){

     

   }

 async actionForm(req, res) {
        let responseAction:responseActionForm = Object.assign({},this.initResponseActionForm())
        let id                      =           req.body.id
        let actionRequerid                    = req.body.actionId
        let actionRequeridName                = req.body.actionName
        var dataToSearch                      =req.body.dataToSearch
        var routerParametros                  = req.body.parameter

        console.log("req.body",req.body)
        
        /****local variables */
        let dataModel:any;
        let resultAccess:mg_acceso_x_modelo_interface;
        let resultModel:any
        let resultForm:any
        let resultView:any
        let one2manyData
        let many2manyData
        let many2oneData
        let extraData

        
          let resultFieldByModel:any
          
           
          const resultGroup=await this.validateUserGroup(id)
            
            if (resultGroup.error==null && resultGroup.data && resultGroup.data.length>0){
                  const resultAction=await this.validateAction(actionRequerid,actionRequeridName)
                     if (resultAction.error==null && resultAction.data && resultAction.data.length>0)
                          
                        if (resultGroup.data.length==1){
                           let resultGroupAction=await this.validateGroupByActionForm(resultAction.data[0].id,resultGroup.data[0].grupo_id)
                         
                              if (resultGroupAction && resultGroupAction.data.length>0 && resultGroupAction.data[0].total>0 ){ //yes, have permissions to action
                                  resultForm=await this.validateGroupByView(resultGroup.data[0].grupo_id,resultAction.data[0].vista_id)
                                  resultView=await this.validateActionByView(actionRequerid,actionRequeridName)
                                  
                                    if (resultView.data[0].outlet)
                                      resultView.data[0].outlet=this.parseOutlet(resultView.data[0].outlet,routerParametros)
                                  if (resultForm.error==null && resultAction.data && resultForm.data.length>0 && resultForm.data[0].total){     
                                        resultModel=await this.getActionModel(resultAction.data[0].respuesta_modelo)
                                          if (resultModel.data && resultModel.data.length>0){
                                              resultFieldByModel=await this.getFieldByModel(resultAction.data[0].respuesta_modelo)
                                              resultAccess  =(await this.accessModel(resultAction.data[0].respuesta_modelo,resultGroup.data[0].grupo_id)).data[0]
                                              let resultMenu=await this.getMenuModel(resultAction.data[0].respuesta_modelo)
                                                    const _resultAction =resultAction.data.shift()
                                                    const _responseModel=resultModel.data.shift()
                                              if (resultAccess && resultAccess.lectura){
                                                
                                                extraData=await this.extraData(resultView.data[0].vista_id)
                                           
                                                 if (_resultAction.dominio!='empty'){
                                                    let parseDominio=await this.parseDominio(_resultAction.dominio,id,dataToSearch)
                                                     dataModel=await this.getDataModel(resultGroup.data[0].grupo_id,_responseModel.modelo,parseDominio,_resultAction.vista_id)    
                                                     responseAction.data=dataModel.data
                                                     one2manyData=await this.getDataModelCat(_responseModel.id)
                                                     many2manyData=await this.many2ManyData(_responseModel.id,resultView.data[0].vista_id,dataToSearch)
                                                     many2oneData=await this.getDataModelmany2one(_responseModel.id,dataToSearch.id)
                                                    
                                                  }
                                                  else
                                                  { 
                                                     dataModel=await this.getDataModel(resultGroup.data[0].grupo_id,_responseModel.modelo,'empty',_resultAction.vista_id)    
                                                     responseAction.data=dataModel.data
                                                     //console.log("_resultAction",_resultAction,dataModel)
                                                     one2manyData=await this.getDataModelCat(_responseModel.id)
                                                  }
                                              }
                                                     const general=await (await this.getGeneral(1)).data.shift()
                                                     

                                                      responseAction.childrenList  = [...this.childrenListArray]
                                                      responseAction.childrenList2 = [...this.items]
                                                      responseAction.id            = _resultAction.id
                                                      responseAction.mode          = _resultAction.mode
                                                      responseAction.menu          = [...resultMenu.data]
                                                      responseAction.model         = _responseModel.modelo
                                                      responseAction.nameModel     = _responseModel.nombre
                                                   //   responseAction.fieldBreadCrumb=_responseModel.fieldsbreadcrumb
                                                      //responseAction.fullname            = _responseModel.fullpath
                                                      responseAction.display_name        = _responseModel.nombre_desplegado
                                                      responseAction.access              = resultAccess
                                                      responseAction.model_id            = _responseModel.id
                                                      responseAction.action.typeAction   = _resultAction.tipo_accion
                                                      responseAction.total_row_model     = await (await this.getCountRowDataModel(_responseModel.modelo)).data[0].total
                                                      responseAction.action.action       = _resultAction.id
                                                      responseAction.action.display_name = _resultAction.nombre_desplegado
                                                      responseAction.action.name         = _resultAction.nombre
                                                      responseAction.action.viewMode     = _resultAction.vista_modo.split(',')
                                                      responseAction.action.viewForm     = _resultAction.vista_forma
                                                      responseAction.action.src_model    = _resultAction.origen_modelo
                                                      responseAction.action.res_model    = _resultAction.respuesta_modelo
                                                      responseAction.action.mode         = _resultAction.modo
                                                      responseAction.action.domain       = _resultAction.dominio
                                                      responseAction.currentAction       = _resultAction.id
                                                      responseAction.view=[...resultView.data]
                                                      responseAction.fullname=resultView.data[0].path
                                                      responseAction.outlet=resultView.data[0].outlet
                                                      responseAction.extraData=extraData
                                                      // responseAction.field=[...resultFieldByModel.data]
                                                      responseAction.field=[...dataModel.select]
                                                      responseAction.one2manydata=one2manyData
                                                      responseAction.many2manydata=many2manyData
                                                      responseAction.many2onedata=many2oneData
                                                      responseAction.pais=general.pais_id
                                                      responseAction.idioma=general.idioma_id
                                                      responseAction.dataToSearch=dataToSearch
                                                      responseAction.parameter=routerParametros
                                                    //  console.log("response action",responseAction,req.body.dataToSearch)
                                                     return res.status(200).json({success: true, data:responseAction, errors:null})
                   
                                            }
                                       //  }       
                                  }
                            }   
                        }   
                }
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
                      id: _result['user_uid']
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
                  user_uid: _result['user_uid']
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

import { ideahub_v1alpha } from 'googleapis'
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

export interface Field{
  name:string,
  type:string,
  datatype:string
  sequence:number,
  id:string,
  label:string,
  placeholder:string,
  maxlength:number,
  required:boolean,
  readonly:boolean,
  index:boolean,
  disabled:boolean
  options:any[]
  fkey:boolean
 
}

export interface Column{
  title:string,
  field:string,
  width:number,
  hozAlign:string,
  sorter:string,
  type:string,
  datatype:string,
  sequence:number,

}


export interface Group{
  namegroup:string
  html:string
  type:string
  fields:Field[]
  component: string
}  

export interface ChildrenListModelType{
    type:string
    nameModel:string,
    id:string,
    foreignKey:string[],
    data:any,
    nameColumns:{
      name:string,
      columns:Column[]
    }
    groups?:Group[] | null, 
    component: string,
    one2many:string,
    nivel:number
    action:string,
    color:string,
    datatype:string,
    icon:string,
    idaction:string,
    children:ChildrenListModelType[]
    idx:number,
    ancestor:number,
    required:boolean
}
export interface responseActionForm{
  id: number,
  model:string,
  fullname:string,
  display_name:string,
  action:{
    action:string,
    viewMode:string[],
    viewForm:string,
    domain:string,
    typeAction:string,
    display_name:string,
    name:string
    res_model:number,
    src_model:number
    mode:string
    
  },
  menu           : any[],
  data           : [{}],
  one2manydata   : [{}],
  many2manydata  : [{}],
  many2onedata   : [{}],
  model_fields   : [{}],
  model_id       : number,
  nameModel      : string,
  total_row_model: number,
  access         : {},
  value          : string,
  currentAction  : number,
  view           : any[],
  field          : any[],
  childrenList   : ChildrenListModelType[],
  childrenList2  : any,
  fieldBreadCrumb: string,
  mode           : string,
  pais           : number,
  idioma         : number,
  outlet         : string,
  dataToSearch   : any,
  extraData      : [{}],
  parameter      : any
  paginacion     : {} 
  sort           : {}
  filtros        : any[] 
}


export interface acs_session_type{
  id          : number;
  name        : string;
  display_name: string;
  help        : string;
  model_id    : number;
  view_mode   : string;
  res_model   : number;
  src_model   : number;  
  view_form   : string;
}
export class mg_accion_forma extends mg_base{
  declare id               : number;
  declare nombre           : string;
  declare nombre_desplegado: string;
  declare ayuda            : string;
  declare modelo_id        : number;
  declare modo_vista       : string;
  declare respuesta_modelo : number;
  declare origen_modelo    : number;
  declare vista_forma      : string;

}


mg_accion_forma.init({
id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
  },
  nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
 nombre_desplegado: {
      type: DataTypes.STRING
    },
 vista_id  : {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
  tipo_accion   : {
    type: DataTypes.ENUM('ACTION_FORM'),
    allowNull:false,
    defaultValue:'ACTION_FORM'
  },

  // DataTypes.ENUM('Card','Form', 'Tree', 'Graph','Calendar','List Items','Table'),
  vista_modo: {
    type: DataTypes.STRING, 
    allowNull: false,
    defaultValue:'Form'
  },

  respuesta_modelo:{
    type: DataTypes.INTEGER,
    allowNull: true,
 },
  origen_modelo:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  dominio:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  dominio_detalle:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  pagina:{
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue:80
  },

  opciones_pagina:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'[10,50,80]'
  },

    vista_forma:{
        type: DataTypes.ENUM('New','Child','List','Detail'),
        allowNull: false,
        defaultValue:'New'
    } ,
    sjoin:{
      type: DataTypes.STRING,
      allowNull: true,
  } ,
  dominio_sjoin:{
    type: DataTypes.STRING(1000),
    allowNull: true,
} ,
  proyection_sjoin:{
      type: DataTypes.STRING,
       allowNull: true,
   } ,
    modo:{
      type: DataTypes.ENUM('create','update','empty','query'),
      allowNull: false,
      defaultValue:'Create'
  } 
  },
  
   {   sequelize,
     //   indexes: [{unique: true, fields: ['email']}],  
        freezeTableName: true,
        modelName: 'mg_accion_forma',
        tableName: 'mg_accion_forma',
        timestamps: false,
        paranoid: true
   })

   mg_accion_forma.sync({force:false,alter:false})
module.exports = mg_accion_forma
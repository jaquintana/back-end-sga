
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from '../models/0_base_base.model'


export interface responseActionMenu{
  menu:type_sys_action_menu
}


export interface type_sys_action_menu{
   display_name: string;
   name        : string;
   id          : number;
   type        : string; 
   active      : boolean;
   child_id    : number;   //m2o
   parent_id   : number;
   model_id    : number;
   action      : number;
   order       : number;
   description : string;
}



export class mg_menu extends mg_base{
      declare nombre_desplegado: string;
      declare nombre           : string;
      declare id               : number;
      declare tipo             : string;
      declare activo           : boolean;
      declare hijo_id          : number;   //m2o
      declare padre_id         : number;
      declare modelo_id        : number;
      declare accion           : number;
      declare orden            : number;
      declare descripcion      : string;

   }
   
  
   mg_menu.init({
    id: {
        type         : DataTypes.INTEGER,
        primaryKey   : true,
        autoIncrement: true,
        allowNull    : false,
      },
      nombre: {
          type     : DataTypes.STRING,
          allowNull: false
        },
   
      nombre_desplegado: {
          type     : DataTypes.STRING,
          allowNull: false
      },
      sub_titulo: {
          type     : DataTypes.STRING,
          allowNull: false
      },
      activo:{
        allowNull: false,
        type     : DataTypes.BOOLEAN,
      },
      hijo_id:{
        allowNull: true,
        type     : DataTypes.INTEGER,
      },
      padre_id:{
        allowNull: true,
        type     : DataTypes.INTEGER,
      },
      accion:{
        allowNull: true,
        type     : DataTypes.INTEGER,
      },
      orden:{
        allowNull: false,
        type     : DataTypes.INTEGER,
      },
      descripcion:{
        allowNull: true,
        type     : DataTypes.STRING,
      },
        //(m2o) sys_module_type
        modelo_id: { 
          type     : DataTypes.INTEGER,
          allowNull: true,
          
        },
        modelo_origen:{
          type     : DataTypes.INTEGER,
          allowNull: true,
        },

        view_inherit_id:{
          type      : DataTypes.INTEGER,
          allowNull : true,
          references: { model: 'mg_vista', key: 'id' },
          onDelete  : 'CASCADE',
          onUpdate  : 'CASCADE',
        },

        valor:{
          type: DataTypes.STRING

        },
      
        icon_image:{
            type: DataTypes.BLOB('long')
            
          },
          icon:{
            type: DataTypes.STRING
          },
          type:{
            type: DataTypes.ENUM('basic','group','none','divider','spacer')
          },
           },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'mg_menu',
            tableName      : 'mg_menu',
            timestamps     : false,
            paranoid       : true
       })

mg_menu.sync({force:false,alter:false})
module.exports = mg_menu
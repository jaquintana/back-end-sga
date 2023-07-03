
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'
import {  Model  } from 'sequelize'





export interface mg_atributo_tipo{
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



export class mg_atributo_tipo extends Model{
      declare id:number;
      declare nombre           : string;
      declare valor:number;
    

   }
   
  
   mg_atributo_tipo.init({
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
   
        
        valor:{
          type: DataTypes.STRING,
          allowNull: true
        },
        activo: {
            type     : DataTypes.ENUM('S','N'),
            allowNull: true
         },
     
         eliminado:{
            allowNull: false,
            type     : DataTypes.ENUM('S','N'),
           },
           fecha_actualizado:{
            allowNull: false,
            type     : DataTypes.DATE,
           },
           fecha_eliminado:{
            allowNull: true,
            type     : DataTypes.DATE,
           },
           fecha_creado:{
            allowNull: false,
            type     : DataTypes.DATE,
           },
           usuario_creo_id:{
            allowNull : false,
            type      : DataTypes.INTEGER,
            references: { model: 'mg_usuario', key: 'id' },
            onDelete  : 'CASCADE',
            onUpdate  : 'CASCADE'
           },
           usuario_actualizo_id:{
            allowNull : false,
            type      : DataTypes.INTEGER,
            references: { model: 'mg_usuario', key: 'id' },
            onDelete  : 'CASCADE',
            onUpdate  : 'CASCADE'
           },
           usuario_elimino_id:{
            allowNull : true,
            type      : DataTypes.INTEGER,
            references: { model: 'mg_usuario', key: 'id' },
            onDelete  : 'CASCADE',
            onUpdate  : 'CASCADE'
        }
      
      },
      
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'mg_atributo_tipo',
            tableName      : 'mg_atributo_tipo',
            timestamps     : false,
            paranoid       : true
      
       })

       mg_atributo_tipo.sync({force:false,alter:false})
module.exports = mg_atributo_tipo
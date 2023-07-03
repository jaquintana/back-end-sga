
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
import { AllowNull } from 'sequelize-typescript';



export class mg_atributo_x_modelo extends Model{
  
       declare id: number; 
       declare nombre:string;
       declare nombre_desplegado:string;
       declare index:number;
       declare ayuda:string;
       declare sololectura:boolean;
       declare campo_relacionado:number;
       declare tamano:number;
       declare requerido:boolean;
       declare tipo_campo:number;
       declare modelo_id:number;
       declare campo_descripcion:string;
       declare llave_foranea:boolean;
}
       mg_atributo_x_modelo.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      nombre: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
        },
       nombre_desplegado: {
          type: DataTypes.STRING,
          defaultValue: "",
          allowNull: true,
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: true,
          }, 
          ayuda: {
            type: DataTypes.STRING,
            defaultValue: "",
          },   
        modelo_id: { 
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: -1,
          references: { model: 'mg_modelo', key: 'id' },
       },
        tipo_campo:{
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'mg_atributo_tipo', key: 'id' },
        
      },
      sololectura:{
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull:true
      },
      requerido:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:true
      },
      origen_campo :{
        type     : DataTypes.ENUM('B','A','O','N'),
        allowNull:false,
        defaultValue:'B'
      },
       campo_relacionado:{
        type: DataTypes.INTEGER,
        defaultValue:-1
       },
       tamano:{
        type: DataTypes.INTEGER,
        defaultValue:-1
       },
       campo_descripcion:
       {
        type: DataTypes.STRING,
        allowNull:true
       },
       llave_foranea:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
       },
       
       activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: true
     },
   
     
       json:{
        type: DataTypes.JSON,
        defaultValue:false,
        allowNull:true
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
            modelName: 'mg_atributo_x_modelo',
            tableName: 'mg_atributo_x_modelo',
            timestamps: false,
            paranoid: true
       })

       mg_atributo_x_modelo.sync({force:false,alter:false})
module.exports = mg_atributo_x_modelo
       


       
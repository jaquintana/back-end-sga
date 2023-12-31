
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'




export class mg_modelo_x_atributo_x_vista extends Model{
  
       declare id: number; 
       declare modelo_x_tributo_id:number;
       declare vista_id:string;
       declare sololectura:boolean;
}
        mg_modelo_x_atributo_x_vista.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
        modelo_x_atributo_id: { 
          type: DataTypes.INTEGER,
          allowNull: false,
       },
        vista_id:{
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      campo_activo:{
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull:true
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
            modelName: 'mg_modelo_x_atributo_x_vista',
            tableName: 'mg_modelo_x_atributo_x_vista',
            timestamps: false,
            paranoid: true
       })

       mg_modelo_x_atributo_x_vista.sync({force:false,alter:false})
module.exports = mg_modelo_x_atributo_x_vista
       


       
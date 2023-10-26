
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'

export class mg_grupo_x_estado extends Model{
  
       declare id: number; 
       declare grupo_id:number;
       declare menu_id:number;
       
       
   }
   
  
   mg_grupo_x_estado.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      grupo_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
      estado_id: {
          type: DataTypes.INTEGER
      },
      receptor:{
        type     : DataTypes.ENUM('S','N'),
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
            modelName: 'mg_grupo_x_estado',
            tableName: 'mg_grupo_x_estado',
            timestamps: false,
            paranoid: true
       })

       mg_grupo_x_estado.sync({force: false, alter: false})
module.exports = mg_grupo_x_estado
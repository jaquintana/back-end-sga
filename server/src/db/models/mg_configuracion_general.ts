
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'




export class mg_configuracion_general extends Model{
  
       declare id: number; 
       declare pais_id: number; 
       declare idioma_id: number; 
       declare descripcion: string; 
       
       
     
}
     mg_configuracion_general.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      pais_iso: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pais_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },  
      idioma_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      base_de_datos:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
       descripcion:
       {
        type: DataTypes.STRING,
        allowNull:true
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
            modelName: 'mg_configuracion_general',
            tableName: 'mg_configuracion_general',
            timestamps: false,
            paranoid: true
       })

       mg_configuracion_general.sync({force:false,alter:false})
module.exports = mg_configuracion_general
       


       
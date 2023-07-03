
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'



export class mg_modelo extends Model{
  
       declare id: number; 
       declare modelo:string;
       declare nombre              : string;
       declare descripcion       : string;
       declare abstract          : boolean;
       declare display_name      :string;
       declare inherit_id        : number;
       
   }
   
  
  mg_modelo.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      modelo: {
          type: DataTypes.STRING,
          allowNull: false
        },
      nombre: {
          type: DataTypes.STRING
      },
     descripcion: {
          type: DataTypes.STRING
        },
     abstract:
     {
        type: DataTypes.BOOLEAN
      },
     nombre_desplegado:
     {
        type: DataTypes.STRING
      },
      
      modelo_heredado:{
        type: DataTypes.INTEGER
      },
      tipo_modelo:
        {
            type: DataTypes.ENUM('manual','base')
        },

        path: {
          type:DataTypes.STRING
        },

        fullpath: {
          type:DataTypes.STRING
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
            modelName: 'mg_modelo',
            tableName: 'mg_modelo',
            timestamps: false,
            paranoid: true
       })

       mg_modelo.sync({force: false, alter: false})
module.exports = mg_modelo
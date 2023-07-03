
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {Model} from 'sequelize'

export class mg_datos_modelo_x_vista  extends Model{
      declare id                : number;
      declare nombre            : string;
      declare modelo_id            : string
      declare contexto          : string
      declare dominio           : string;
      declare sql               : string;
      declare tipo              : number;
      declare vista_id           : number;

      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number

   }
   
   mg_datos_modelo_x_vista.init({
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    nombre: {
          type: DataTypes.STRING,
          allowNull: false
        },
    modelo_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },    
   contexto:{
    type: DataTypes.STRING,
    allowNull: false
   },
   dominio:{
    type: DataTypes.STRING,
    allowNull: false
   }      ,
   modelo_sql:{
    type: DataTypes.STRING,
    allowNull: false
   }  ,
   tipo:{
    type: DataTypes.ENUM('SQL','MODELO'),
    allowNull: false
   }      ,
   vista_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },    


     activo: {
            type: DataTypes.ENUM('S','N'),
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
      allowNull: false,
      type     : DataTypes.INTEGER,
      references: { model: 'mg_usuario', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
     },
     usuario_actualizo_id:{
      allowNull: false,
      type     : DataTypes.INTEGER,
      references: { model: 'mg_usuario', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
     },
     usuario_elimino_id:{
      allowNull: true,
      type     : DataTypes.INTEGER,
      references: { model: 'mg_usuario', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
     }
 
     },
       {  sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'mg_datos_modelo_x_vista',
            tableName: 'mg_datos_modelo_x_vista',
            timestamps: false,
            paranoid: true
       })

       mg_datos_modelo_x_vista.sync({force: false, alter: false})
module.exports =mg_datos_modelo_x_vista

import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
//import { mg_modelo } from '../herencia/base.model';
import {Model} from 'sequelize'

export class mg_cat_municipio  extends Model{
      declare id           : number;
      declare nombre       : string;
      declare departamento : number;
      declare activo:string
      declare eliminado:string
      declare fecha_creado  : Date;
      declare fecha_actualizado: Date;
      declare fecha_eliminado  : Date;
      declare usuario_creo_id:number;
      declare usuario_actualizo_id:number;
      declare usuario_elimino_id:number

   }
   
   mg_cat_municipio.init({
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    nombre: {
          type: DataTypes.STRING,
          allowNull: false
        },
    departamento_id:{
        allowNull: false,
        
        type: DataTypes.INTEGER,
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
            modelName: 'mg_cat_municipio',
            tableName: 'mg_cat_municipio',
            timestamps: false,
            paranoid: true
       })

       mg_cat_municipio.sync({force: false, alter: false})
module.exports =mg_cat_municipio

import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {Model} from 'sequelize'

export class mg_puesto_organizacional  extends Model{
      declare id                  : number;
      declare nombre              : string;
      declare activo              : string
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number

   }

   mg_puesto_organizacional.init({
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    nombre: {
          type: DataTypes.STRING,
          allowNull: false
        },
    unidad_organizacional_id:
    {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jerarquia:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    puesto_organizacional_id:
    {
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
            modelName: 'mg_puesto_organizacional',
            tableName: 'mg_puesto_organizacional',
            timestamps: false,
            paranoid: true
       }) 
          

       mg_puesto_organizacional.sync({force: false, alter: false})
module.exports =mg_puesto_organizacional
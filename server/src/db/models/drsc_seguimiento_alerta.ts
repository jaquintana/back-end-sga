
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {Model} from 'sequelize'

export class drsc_cat_estado_alerta  extends Model{
      declare id                  : number;
      declare alerta_id           : string;
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
   
   drsc_cat_estado_alerta.init({
    id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    nombre: {
          type: DataTypes.STRING,
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
            modelName: 'drsc_cat_estado_alerta',
            tableName: 'drsc_cat_estado_alerta',
            timestamps: false,
            paranoid: true
       })

       drsc_cat_estado_alerta.sync({force: false, alter: false})
module.exports =drsc_cat_estado_alerta
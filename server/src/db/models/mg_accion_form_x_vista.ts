
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
import moment from 'moment-timezone';
import { toDefaultValue } from 'sequelize/types/utils';

export class mg_accion_forma_x_vista  extends Model{
      declare id                  : number;
      declare accion_forma_id              : number;
      declare vista_id                : number;
      declare activo              : string
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
      

   }
   
   mg_accion_forma_x_vista.init({

    id: {
            type      : DataTypes.INTEGER,
            primaryKey: true,
            allowNull : false,
        },
     
     accion_forma_id:{
      type      : DataTypes.INTEGER,
      allowNull : false,
     },

     vista_id:{
      type      : DataTypes.INTEGER,
      allowNull : false,
     },
    nombre: {
          type     : DataTypes.STRING,
          allowNull: false
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
        defaultValue:moment().tz("America/Guatemala").toDate()
       },
       fecha_eliminado:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_creado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue:moment().tz("America/Guatemala").toDate()
       },
       usuario_creo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE',
        defaultValue:1
       },
       usuario_actualizo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE',
        defaultValue:1
       }
   ,
   usuario_elimino_id:{
    allowNull : true,
    type      : DataTypes.INTEGER,
    references: { model: 'mg_usuario', key: 'id' },
    onDelete  : 'CASCADE',
    onUpdate  : 'CASCADE'
   }
     },
       {  sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'mg_accion_forma_x_vista',
            tableName      : 'mg_accion_forma_x_vista',
            timestamps     : false,
            paranoid       : true
       })

       mg_accion_forma_x_vista.sync({force: false, alter: false})
module.exports = mg_accion_forma_x_vista
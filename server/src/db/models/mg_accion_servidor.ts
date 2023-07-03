
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
import moment from 'moment-timezone';
import { toDefaultValue } from 'sequelize/types/utils';

export class mg_accion_servidor  extends Model{
      declare id                  : number;
      declare nombre              : string;
      
      declare activo              : string
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
      

   }
   
   mg_accion_servidor.init({

    id: {
            type      : DataTypes.INTEGER,
            primaryKey: true,
            allowNull : false,
        },

    nombre: {
          type     : DataTypes.STRING,
          allowNull: false
        },
     //modelo que actualizara   
    modelo_id:{
         allowNull : false,
         type      : DataTypes.INTEGER,
      },
    // id que actualizara si actualiza un registro entonces este es parte de la clausula where 
    ref_id:{
        type      : DataTypes.STRING,
        allowNull : false,
     },
     set_id:{
        type      : DataTypes.STRING,
        allowNull : false,

     },
    // si el tipo de accion es codigo, entonces ejecutara lo que se encuentra dentro de esta variable 
     codigo:{
        type      : DataTypes.STRING,
        allowNull : false
       },
    tipo_accion_id:{
        type      : DataTypes.INTEGER,
        allowNull : false,

    } , 
    class:{ 
        type      : DataTypes.STRING,
        allowNull : true,
    },
    function:{
        type      : DataTypes.STRING,
        allowNull : true,
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
            modelName      : 'mg_accion_servidor',
            tableName      : 'mg_accion_servidor',
            timestamps     : false,
            paranoid       : true
       })

       mg_accion_servidor.sync({force: false, alter:false})
module.exports = mg_accion_servidor
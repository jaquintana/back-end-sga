
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'

//import { mg_modelo } from '../herencia/base.model'
import moment from 'moment-timezone';

export declare interface Filtro{
    operadorDer:any
    operador:any
    operadorIzq:any
  }
  

export class mg_preferencia  extends Model{
      declare id                  : number
      declare filtros             : Filtro
      declare activo              : number
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
   }
   
   mg_preferencia.init({
    id:{
        type         : DataTypes.INTEGER,
        primaryKey   : true,
        autoIncrement: true,
        allowNull    : false,
    },

    usuario_id:{
        type         : DataTypes.INTEGER,
        allowNull    : false,
    },

    vista_id:{
       type: DataTypes.INTEGER,
       allowNull:false
    },

    filtro:{
        type:  DataTypes.JSON,
        allowNull    : true
    },
   
    activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: true
     },

     eliminado:{
        type     : DataTypes.ENUM('S','N'),
        allowNull: false
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
       { 
        hooks:{
            beforeCreate: (async (instance,record) => {
              instance.fecha_creado = new Date(moment().tz("America/Guatemala").format())
            }),
            beforeUpdate:(async (instance, options) => {
              instance.fecha_actualizado = new Date(moment().tz("America/Guatemala").format())
              
               if (instance.eliminado=='S'&& instance.previous.name=='N')
                 instance.fecha_eliminado = new Date(moment().tz("America/Guatemala").format())
            }),
           } ,
            sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'mg_preferencia',
            tableName      : 'mg_preferencia',
            timestamps     : false,
            paranoid       : true
       })

      mg_preferencia.sync({force:false, alter: false})
      module.exports = mg_preferencia
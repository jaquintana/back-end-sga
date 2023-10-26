
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
//import { mg_modelo } from '../herencia/base.model'
import moment from 'moment-timezone';

export class drsc_diligenciamiento  extends Model{
      declare id                  : number
      declare nombre              : string
      declare activo              : number
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
   }
   
   drsc_diligenciamiento.init({
    id:{
        type         : DataTypes.INTEGER,
        primaryKey   : true,
        autoIncrement: true,
        allowNull    : false,
    },
    alerta_id:{
        type     : DataTypes.STRING,
        allowNull: false,
    },
    delitos:{
        type     : DataTypes.STRING,
        allowNull: false,
    },
    descripcion_hecho
    :{
        type     : DataTypes.STRING,
        allowNull: false,
    },
    cantidad_monetaria
    :{
        type     : DataTypes.DOUBLE,
        allowNull: true,
    },
  
    activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: true,
        defaultValue:'S'
     },
     eliminado:{
        allowNull: false,
        type     : DataTypes.ENUM('S','N'),
        defaultValue:'N'
       },
       fecha_actualizado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue: new Date(moment().tz("America/Guatemala").format())
       },
       fecha_eliminado:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_creado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue: new Date(moment().tz("America/Guatemala").format())
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
        sequelize,
        tableName      : 'drsc_diligenciamiento',
        modelName      : 'drsc_diligenciamiento',
        hooks:{
          beforeCreate: (async (instance,record) => {
            instance.fecha_creado = new Date(moment().tz("America/Guatemala").format())
            instance.fecha_actualizado = new Date(moment().tz("America/Guatemala").format())
          }),
          beforeUpdate:(async (instance, options) => {
            instance.fecha_actualizado = new Date(moment().tz("America/Guatemala").format())
            
             if (instance.eliminado=='S'&& instance.previous.name=='N')
               instance.fecha_eliminado = new Date(moment().tz("America/Guatemala").format())
          }),
         } ,
          
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            timestamps     : false,
            paranoid       : true
       })

       drsc_diligenciamiento.sync({force:false, alter: false})
      module.exports = drsc_diligenciamiento
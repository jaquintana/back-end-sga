
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
//import { mg_modelo } from '../herencia/base.model'
import moment from 'moment-timezone';

export class drsc_cat_tipo_documento  extends Model{
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
   
   drsc_cat_tipo_documento.init({
    id:{
        type         : DataTypes.INTEGER,
        primaryKey   : true,
        autoIncrement: true,
        allowNull    : false,
    },
    nombre:{
        type     : DataTypes.STRING,
        allowNull: false,
    },
    tipo_id:{
      type      : DataTypes.INTEGER,
      allowNull : false,
      references: { model: 'drsc_cat_tipo_institucion', key: 'id' },
      onDelete  : 'CASCADE',
      onUpdate  : 'CASCADE'
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
            modelName      : 'drsc_cat_tipo_documento',
            tableName      : 'drsc_cat_tipo_documento',
            timestamps     : false,
            paranoid       : true
       })

       drsc_cat_tipo_documento.sync({force:false, alter: false})
      module.exports = drsc_cat_tipo_documento
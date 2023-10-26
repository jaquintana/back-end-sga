
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
import moment from 'moment-timezone';
import { toDefaultValue } from 'sequelize/types/utils';

export class mg_cat_departamento  extends Model{
      declare id                  : number;
      declare nombre              : string;
      declare pais                : number;
      declare activo              : string
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
      

   }
   
   mg_cat_departamento.init({

    id: {
            type      : DataTypes.INTEGER,
            primaryKey: true,
            allowNull : false,
        },

    nombre: {
          type     : DataTypes.STRING,
          allowNull: false
        },
    pais:{
        allowNull : false,
        type      : DataTypes.STRING,
      },
   region_id:{
        allowNull : false,
        /*references: { model: 'mg_cat_region', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE',*/
        type      : DataTypes.INTEGER,
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
            modelName      : 'mg_cat_departamento',
            tableName      : 'mg_cat_departamento',
            timestamps     : false,
            paranoid       : true
       })

       mg_cat_departamento.sync({force: false, alter: true})
module.exports = mg_cat_departamento
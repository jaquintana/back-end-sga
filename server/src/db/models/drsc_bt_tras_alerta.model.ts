
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {Model} from 'sequelize'
import moment from 'moment-timezone';

export class drsc_bt_estado_alerta  extends Model{
      declare id                  : number;
      declare nombre_alerta       : string;
      declare operacion           : number;
      declare nombre_estado_actual: string;
      declare nombre_nuevo_estado :string; 
      declare alerta_id           : string;
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare usuario_creo_id     : number;
    }
   
    drsc_bt_estado_alerta.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
        },

    operacion:{
    type: DataTypes.TINYINT,
          allowNull: false
    },

    nombre_operacion:{
        type: DataTypes.STRING,
              allowNull: false
    },
    nombre_estado_actual:{
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre_nuevo_estado:{
      type: DataTypes.STRING,
      allowNull: false
    },
    alerta_id: {
            type: DataTypes.STRING,
            allowNull: true
    },
    nombre_alerta: {
        type: DataTypes.STRING,
        allowNull: true
    },  
    usuario: {
      type: DataTypes.STRING,
      allowNull: true
     },  
    siguiente_estado: {
      type: DataTypes.INTEGER,
      allowNull: true
  },  
    eliminado:{
            allowNull: false,
            type     : DataTypes.ENUM('S','N'),
            defaultValue:'N'
     },
    
     
     fecha_creado:{
      allowNull: false,
      type     : DataTypes.DATE,
      defaultValue: new Date(moment().tz("America/Guatemala").format())
     },
     usuario_creo_id:{
      allowNull: false,
      type     : DataTypes.INTEGER,
      references: { model: 'mg_usuario', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
     }
     
 
     },
       {  sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'drsc_bt_estado_alerta',
            tableName: 'drsc_bt_estado_alerta',
            timestamps: false,
            paranoid: true
       })

       drsc_bt_estado_alerta.sync({force: false, alter: false})
module.exports =drsc_bt_estado_alerta

import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'
import moment from 'moment-timezone';

export class drsc_buzon_x_alerta extends mg_base{
  declare alerta_id:number;
  declare buzon_id:boolean;
}


drsc_buzon_x_alerta.init({
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false,
  },

 alerta_id: {
      type: DataTypes.STRING,
      allowNull: false
  },
 buzon_id:{
  type: DataTypes.STRING,
  allowNull: false

 },   
 activo: {
    type     : DataTypes.ENUM('S','N'),
    allowNull: false,
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
   },
   usuario_elimino_id:{
    allowNull : true,
    type      : DataTypes.INTEGER,
    references: { model: 'mg_usuario', key: 'id' },
    onDelete  : 'CASCADE',
    onUpdate  : 'CASCADE'
}

   },
   {   sequelize,
     //   indexes: [{unique: true, fields: ['email']}],  
        freezeTableName: true,
        modelName: 'drsc_buzon_x_alerta',
        tableName: 'drsc_buzon_x_alerta',
        timestamps: false,
        paranoid: true
   })

   drsc_buzon_x_alerta.sync({force:false, alter:false})
   module.exports = drsc_buzon_x_alerta
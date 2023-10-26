
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

export class drsc_documento_alerta extends mg_base{
  declare usuario_id:number;
  declare buzon_id:boolean;
  declare module_id:number; //m2o
  declare extern_id:string;
}


drsc_documento_alerta.init({
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

  tipo_documento_id:{
    type: DataTypes.INTEGER,
    allowNull: true
  },

nombre:{
    type: DataTypes.STRING,
    allowNull: true
  },
  numero_documento_id:{
    type: DataTypes.STRING,
    allowNull: true
  },
  ubicacion_documento:{
    type: DataTypes.STRING,
    allowNull: true
  },
  nombre_archivo:{
    type: DataTypes.STRING,
    allowNull: true
  },

  fecha_documento:{
    type: DataTypes.DATE,
    allowNull: true

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
    defaultValue: new Date()
   },
   fecha_eliminado:{
    allowNull: true,
    type     : DataTypes.DATE,
   },
   fecha_creado:{
    allowNull: false,
    type     : DataTypes.DATE,
    defaultValue: new Date()
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
        modelName: 'drsc_documento_alerta',
        tableName: 'drsc_documento_alerta',
        timestamps: false,
        paranoid: true
   })

   drsc_documento_alerta.sync({force:false, alter:false})
module.exports = drsc_documento_alerta


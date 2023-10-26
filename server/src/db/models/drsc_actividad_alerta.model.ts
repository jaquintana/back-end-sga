
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

export class drsc_actividad_alerta extends mg_base{
  declare id:number;
  declare alerta_id:string;
  declare tipo_actividad_id:number; //m2o
  
}


drsc_actividad_alerta.init({
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

  tipo_actividad_id:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  propietario_id:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado_actividad_id:{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_inicio:{
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_fin:{
    type: DataTypes.DATE,
    allowNull: true
  },

  nota:{
    type: DataTypes.STRING,
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
        modelName: 'drsc_actividad_alerta',
        tableName: 'drsc_actividad_alerta',
        timestamps: false,
        paranoid: true
   })

   drsc_actividad_alerta.sync({force:false, alter:false})
module.exports = drsc_actividad_alerta

import   {mg_base}  from './0_base_base.model'
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/connection'



export class mg_usuario_x_institucion extends mg_base{
}

mg_usuario_x_institucion.init(
  {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_usuario', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  institucion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_institucion', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  activo: {
    type     : DataTypes.ENUM('S','N'),
    allowNull: false,
    defaultValue:'N'
 },

 eliminado:{
    allowNull: false,
    type     : DataTypes.ENUM('S','N'),
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
  {
    sequelize,
    freezeTableName: true,
    modelName: 'mg_usuario_x_institucion',
    tableName: 'mg_usuario_x_institucion',
    timestamps: false,
    paranoid: true

  }
)

mg_usuario_x_institucion.sync({force:false,alter:false})
module.exports = mg_usuario_x_institucion
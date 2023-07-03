

import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/connection'



export class mg_grupo_x_modelo_atributo extends Model{
}

mg_grupo_x_modelo_atributo.init(
  {
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_grupo', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_atributo_x_modelo', key: 'id' },
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
    modelName: 'mg_grupo_x_modelo_atributo',
    tableName: 'mg_grupo_x_modelo_atributo',
    timestamps: false,
    paranoid: true

  }
)

mg_grupo_x_modelo_atributo.sync({force:false,alter:false})
module.exports = mg_grupo_x_modelo_atributo
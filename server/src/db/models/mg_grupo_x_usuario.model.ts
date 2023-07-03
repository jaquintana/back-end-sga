

import   {mg_base}  from './0_base_base.model'
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/connection'


export class mg_grupo_x_usuario extends mg_base{
}

mg_grupo_x_usuario.init(
  {
  grupo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_grupo', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mg_usuario', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:true
  },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'mg_grupo_x_usuario',
    tableName: 'mg_grupo_x_usuario',
    timestamps: true,
    paranoid: true

  }
)

mg_grupo_x_usuario.sync({force:false,alter:false})
module.exports = mg_grupo_x_usuario
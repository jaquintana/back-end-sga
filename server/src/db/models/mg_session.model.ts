

import   {mg_base}  from './0_base_base.model'
import { DataTypes} from 'sequelize'
import { sequelize } from '../../config/connection'

export interface mg_sesion_type{
  id               : number,
  activo           : boolean,
  usuario_id          : number,
  token_id         : string,
  token_extended_at: Date,
  token_expired_at : Date
}

export class mg_sesion extends mg_base{
}

mg_sesion.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    activo:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },

    token_id: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    token_extended_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  
    token_expired_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'mg_sesion',
    tableName: 'mg_sesion',
    timestamps: true,
    paranoid: false,
        defaultScope: {
            attributes: { exclude: ['createdAt','updatedAt'] }
        },
        
  },
    
)

mg_sesion.sync({force:false, alter:false})
module.exports = mg_sesion
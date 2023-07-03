

import   {mg_base}  from './0_base_base.model'
import { DataTypes} from 'sequelize'
import { sequelize } from '../../config/connection'

export interface alerta_adjuntos{
  id               : number,
  entidad: boolean,
  activo           : boolean,
  tipo_alerta_id   : string,
  anio:number
  
}

export class alerta_adjuntos extends mg_base{
}

alerta_adjuntos.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    entidad:{
        allowNull: false,
        type: DataTypes.STRING,
    },

    tipo_alerta_id: {
        type: DataTypes.CHAR(1),
        allowNull: false,
    },

    
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  
    correlativo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    //no se cual es su funcion
    url_adjunto:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    activo:{
        type: DataTypes.ENUM('1','0'),
        allowNull: false,
    }

  },
  {
    sequelize,
    freezeTableName: true,
    modelName: 'alerta_adjuntos',
    tableName: 'alerta_adjuntos',
    timestamps: true,
    paranoid: false,
        defaultScope: {
            attributes: { exclude: ['createdAt','updatedAt'] }
        },
        
  },
    
)

alerta_adjuntos.sync({force:true, alter:true})
module.exports = alerta_adjuntos
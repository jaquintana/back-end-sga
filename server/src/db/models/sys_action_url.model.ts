
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

export interface responseActionUrl{
    action:type_sys_action_url


}


export interface type_sys_action_url{
     id          : number;
     name        : string;
     display_name: string;
     url         : string;
     target      : string;
     type_action : string;
     parameter   : string;
     currentAction:number;
}

export class mg_accion_navegar extends mg_base{
     
    declare id          : number;
    declare name        : string;
    declare display_name: string;
    declare url         : string;
    declare target      : string;
    declare type_action : string;
    declare parameter   : string;
 
 }
 

mg_accion_navegar.init({
  id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      display_name: {
        type: DataTypes.STRING
      },
    tipo_accion   : {
      type: DataTypes.ENUM('ACTION_URL'),
      allowNull:false,
      defaultValue:'ACTION_URL'
    },

    target :{
      type: DataTypes.ENUM('SELF','NEW'),
      allowNull:true,
    },
    url :{
      type: DataTypes.STRING,
      allowNull:true,
    },
    parameter :{
      type: DataTypes.STRING,
      allowNull:true,
    },
    },
     {    sequelize,
          freezeTableName: true,
          modelName: 'mg_accion_navegar',
          tableName: 'mg_accion_navegar',
          timestamps: false,
          paranoid: true
     })

     mg_accion_navegar.sync({force:false,alter :false})
module.exports = mg_accion_navegar
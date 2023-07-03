
import {  Model,  } from 'sequelize'

export  class mg_base extends Model {
    declare id
    declare creado : Date
    declare actualizado : Date
    declare eliminado : Date
    declare creadoUID: number

  }

    
  

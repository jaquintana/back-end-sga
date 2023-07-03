
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from '../models/0_base_base.model'


export interface responseActionMenu{
  menu:type_sys_action_menu
}


export interface type_sys_action_menu{
   display_name: string;
   name        : string;
   id          : number;
   type        : string; 
   active      : boolean;
   child_id    : number;   //m2o
   parent_id   : number;
   model_id    : number;
   action      : number;
   order       : number;
   description : string;
}



export class ui_menu extends mg_base{
      declare display_name: string;
      declare name        : string;
      declare id          : number;
      declare type        : string; 
      declare active      : boolean;
      declare child_id    : number;   //m2o
      declare parent_id   : number;
      declare model_id    : number;
      declare action      : number;
      declare order       : number;
      declare description : string;

   }
   
  
   
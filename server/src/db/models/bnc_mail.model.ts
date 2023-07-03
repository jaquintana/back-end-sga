
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from '../models/0_base_base.model'

/*TYPES*/
/*************** */
//1: Confirmation Mail




export class bnc_mail extends mg_base{
      
      declare id:number ;
      declare active:boolean;
      declare token:string; //m2o
      declare type_mail:string;
      declare user_uid:number;

   }
   
  
  bnc_mail.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
     },
     token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
     },
     type_mail: {
        type: DataTypes.ENUM('Confirmation Mail'),
        allowNull: false,
        },
    user_uid:{
        type: DataTypes.INTEGER,
        allowNull:true
    }  
     },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'bnc_mail',
            tableName: 'bnc_mail',
            timestamps: true,
            paranoid: true
       })

//bnc_mail.sync({force: false, alter: false})
module.exports = bnc_mail
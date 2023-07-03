
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

/*TYPES*/
/*************** */
//1: Confirmation Mail




export class bnc_mail_error extends mg_base{
      
      declare id:number ;
      declare token:string; //m2o
      declare description:string;
      declare user_uid:string;
   }
   
  
  bnc_mail_error.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
     token: {
        type: DataTypes.STRING,
        allowNull: false,
     },
     user_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      
     },
     description:{
        type: DataTypes.STRING,
        allowNull:true
    }  
     },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'bnc_mail_error',
            tableName: 'bnc_mail_error',
            timestamps: true,
            paranoid: true
       })

//bnc_mail_error.sync({force: false, alter: true})
module.exports = bnc_mail_error
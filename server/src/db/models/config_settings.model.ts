import { DataTypes} from 'sequelize'
import { sequelize } from '../../config/connection'
import   {mg_base}  from './0_base_base.model'

export interface config_settings{
  id                :number,
  domain            :string,
  user_active_count :number,
  company_id        :number,
  company_name      :string;
  country_code      :string;
  display_name      :string;
  
}


export class config_settings extends mg_base{

    declare id                :number;
    declare domain            :string;
    declare user_active_count :number;
    declare company_id        :number;
    declare company_name      :string;
    declare country_code      :string;
    declare display_name      :string;     

   }
   
  config_settings.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull:false  
        },

     user_active_count:{
         type: DataTypes.INTEGER,
         allowNull:true
    },

     company_count  :{
        type: DataTypes.INTEGER,
        allowNull:true
   },
     company_id:{
     type: DataTypes.INTEGER,
      allowNull:true
   },
      company_name:{
        type: DataTypes.STRING,
        allowNull:true
   },
   country_code:{
    type: DataTypes.STRING,
    allowNull:true
    },
    display_name:{
      type: DataTypes.STRING,
      allowNull:true
      },


     
    },
       {   sequelize,
            freezeTableName: true,
            modelName: 'config_settings',
            tableName: 'config_settings',
            timestamps: true,
            paranoid: true
        })

  //      config_settings.sync({force: true,alter:true})
 module.exports = config_settings
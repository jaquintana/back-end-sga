
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class mg_grupo extends mg_base{
      declare display_name;
      declare name ;
      declare id;
      declare module_type; //m2o
   }
   
  
  mg_grupo.init({
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
     activo:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false   
      },
        


           },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'mg_grupo',
            tableName: 'mg_grupo',
            timestamps: false,
            paranoid: true
       })

      mg_grupo.sync({force: false, alter: false})
module.exports =mg_grupo
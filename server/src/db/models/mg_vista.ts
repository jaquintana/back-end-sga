
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from '../models/0_base_base.model'


export class mg_vista extends mg_base{
      declare display_name:string;
      declare name :string;
      declare id:number;
      declare active:boolean;
      declare module_id:number; //m2o
      declare extern_id:string;
   }
   
  
   mg_vista.init({
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
      },
        
        modelo: { 
          type: DataTypes.STRING,
          allowNull: true,
        },
        path: { 
          type: DataTypes.STRING,
          allowNull: true,
        },
        fullpath: { 
          type: DataTypes.STRING,
          allowNull: true,
        },
        outlet:{
          type: DataTypes.STRING,
          allowNull: true,
        },


        inherit_id:{
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'mg_vista', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        extern_id:
        {
          type: DataTypes.STRING,
          allowNull: false
        },


          tipo_vista:
          {
            type: DataTypes.ENUM('List','Card','Form', 'Tree', 'Graph','Calendar','List Items','Table','null'),
            allowNull: true,
            defaultValue:'Card'
          },

          vista:
          {
            type: DataTypes.TEXT,
            allowNull: true,
          },

      
           },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'mg_vista',
            tableName: 'mg_vista',
            timestamps: false,
            paranoid: true
       })

       mg_vista.sync({force:false, alter:false})
module.exports = mg_vista
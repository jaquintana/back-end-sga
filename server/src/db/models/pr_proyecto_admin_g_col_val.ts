
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class pr_proyecto_a_g_col_val extends mg_base{
      declare id:number;
      declare col_id:number //foreign key of pr_proyecto
      declare nombre :string;
      declare activo:boolean;
      declare tipo:number;
}
   
  
   pr_proyecto_a_g_col_val.init({

     id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
         allowNull: false,
      },
      /*fk pr_proyecto_admin*/
      col_id:{
          type: DataTypes.STRING,
          allowNull: false
      },
      val: {
          type: DataTypes.STRING,
          allowNull: false
      },
      type_col: {
         type: DataTypes.STRING,
         allowNull: false
      },

      proyecto_admin_grupo_id:{
        type: DataTypes.STRING,
          allowNull: false
      },
      activo:{
         allowNull: false,
         type     : DataTypes.ENUM('S','N'),
         defaultValue:'S'
        },
           eliminado:{
             allowNull: false,
             type     : DataTypes.ENUM('S','N'),
             defaultValue:'N'
            },
      

       },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'pr_proyecto_a_g_col_val',
            tableName: 'pr_proyecto_a_g_col_val',
            timestamps: false,
            paranoid: true
       })

       pr_proyecto_a_g_col_val.sync({force:false, alter:false})
module.exports = pr_proyecto_a_g_col_val

import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class pr_buzon_x_usuario extends mg_base{
      declare display_name:string;
      declare name :string;
      declare id:number;
      declare active:boolean;
      declare module_id:number; //m2o
      declare extern_id:string;
   }
   
  
   pr_buzon_x_usuario.init({
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
   
     
      activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'N'
     },
 
     eliminado:{
        allowNull: false,
        type     : DataTypes.ENUM('S','N'),
       },
       fecha_actualizado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue: new Date()
       },
       fecha_eliminado:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_creado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue: new Date()
       },
       usuario_creo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE',
        defaultValue:1
       },
       usuario_actualizo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE',
        defaultValue:1
       },
       usuario_elimino_id:{
        allowNull : true,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
    }

       },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'pr_buzon_x_usuario',
            tableName: 'pr_buzon_x_usuario',
            timestamps: false,
            paranoid: true
       })

       pr_buzon_x_usuario.sync({force:false, alter:false})
module.exports = pr_buzon_x_usuario
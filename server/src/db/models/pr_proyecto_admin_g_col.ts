
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class pr_proyecto_a_g_col extends mg_base{
      declare id:number;
      declare proyecto_grupo_id:number //foreign key of pr_proyecto
      declare nombre :string;
      declare activo:boolean;
      declare tipo:number;
}
   
  
   pr_proyecto_a_g_col.init({

     id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
         allowNull: false,
      },
      /*fk pr_proyecto_admin_grupo*/
      proyecto_admin_grupo_id:{
        type: DataTypes.STRING,
          allowNull: false
      },
     
      nombre: {
          type: DataTypes.STRING,
          allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
      orden: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
      nombre_desplegado: {
        type: DataTypes.STRING,
        allowNull: false
    },


      tipo:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
     

   /***default values */
   activo:{
    allowNull: false,
    type     : DataTypes.ENUM('S','N'),
    defaultValue:'S'
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
            modelName: 'pr_proyecto_a_g_col',
            tableName: 'pr_proyecto_a_g_col',
            timestamps: false,
            paranoid: true
       })

       pr_proyecto_a_g_col.sync({force:false, alter:false})
module.exports = pr_proyecto_a_g_col
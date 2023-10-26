
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class pr_proyecto_admin extends mg_base{
      declare id:number;
      declare proyect_id:number //foreign key of pr_proyecto
      declare nombre_desplegado:string;
      declare nombre :string;
      declare activo:boolean;
      declare responsable:string;
      declare fecha_vencimiento:Date 
      declare fecha_inicio:Date
      declare fecha_fin:Date
      declare estado:number // type one2many
      declare prioridad:number //type one2many
      declare notas:string
   }
   
   pr_proyecto_admin.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },

     
      /*fk pr_proyecto*/
      proyecto_id:{
       type: DataTypes.STRING,
       allowNull: false

     },

     proyecto_admin_id:{

        type: DataTypes.INTEGER,
        allowNull: false
     },

      nombre: {
          type: DataTypes.STRING,
          allowNull: false
      },
   
      nombre_desplegado: {
        type: DataTypes.STRING,
        allowNull: false
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: true
  },

     
      activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'N'
     },

     responsable:{
      allowNull : true,
      type      : DataTypes.INTEGER,
      references: { model: 'mg_usuario', key: 'id' },
      onDelete  : 'CASCADE',
      onUpdate  : 'CASCADE',
     },


     fecha_vencimiento:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_inicio:{
        allowNull: false,
        type     : DataTypes.DATE,
        
       },
  
       fecha_fin:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       
  
       estado:{
        allowNull: false,
        type      : DataTypes.INTEGER,
        defaultValue: 1 //uno es estado inicial o NO INICIADO
       },
  
       prioridad:{
        allowNull: false,
        type      : DataTypes.INTEGER,
        defaultValue: 1 //uno es estado inicial o NO INICIADO
       },

       notas:{
        allowNull: true,
        type      : DataTypes.TEXT,
       },

       


   /***default values */
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
            modelName: 'pr_proyecto_admin',
            tableName: 'pr_proyecto_admin',
            timestamps: false,
            paranoid: true
       })

       pr_proyecto_admin.sync({force:false, alter:false})
module.exports = pr_proyecto_admin
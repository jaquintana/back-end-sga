
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class pr_proyecto extends mg_base{
      declare id:number;
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
      declare num_actualiza:number

   }
   
  
   pr_proyecto.init({

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
   
      nombre_desplegado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fondo: {
      type: DataTypes.STRING,
      allowNull: true
    },

     descripcion:{
      type: DataTypes.STRING,
      allowNull: true
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
            modelName: 'pr_proyecto',
            tableName: 'pr_proyecto',
            timestamps: false,
            paranoid: true
       })

       pr_proyecto.sync({force:false, alter:false})
module.exports = pr_proyecto
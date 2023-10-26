
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'


export class drsc_buzon extends mg_base{
      declare nombre_desplegado:string;
      declare nombre :string;
      declare id:string;
      declare activo:boolean;
   }
   
  
   drsc_buzon.init({
    id:{
        type        : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey  : true,
        allowNull   : false,
    },
     nombre: {
          type: DataTypes.STRING(25),
          allowNull: false
      },
      nombre_desplegado: {
        type: DataTypes.STRING(25),
        allowNull: true
    },

    activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'S'
     },
 
     eliminado:{
        allowNull: false,
        type     : DataTypes.ENUM('S','N'),
        defaultValue:'N'
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
            modelName: 'drsc_buzon',
            tableName: 'drsc_buzon',
            timestamps: false,
            paranoid: true
       })

       drsc_buzon.sync({force:false, alter:false})
module.exports = drsc_buzon
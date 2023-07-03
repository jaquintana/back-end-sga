
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'



export class mg_one2many extends mg_base{
     
    declare id          : number;
    declare nombre        : string;
    declare nombre_desplegado: string;
    declare padre_id       : number;
    declare modelo_id      : number;
    declare llaveforanea    :string;
 
 }
 

 mg_one2many.init({
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
        type: DataTypes.STRING
      },
    padre_id   : {
        type: DataTypes.INTEGER,
        references: { model: 'mg_modelo', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull:false,
    },
    
    modelo_id: 
    {  type: DataTypes.INTEGER,
       references: { model: 'mg_modelo', key: 'id' },
       onDelete: 'CASCADE',
       onUpdate: 'CASCADE',
       allowNull:false,
    },
    llaveforanea  :{
        type: DataTypes.STRING,
        allowNull:false,
        
    },
    contexto:{
        type: DataTypes.STRING,
        allowNull:true
       },
    activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: true
     },
 
     eliminado:{
        allowNull: false,
        type     : DataTypes.ENUM('S','N'),
       },
       fecha_actualizado:{
        allowNull: false,
        type     : DataTypes.DATE,
       },
       fecha_eliminado:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_creado:{
        allowNull: false,
        type     : DataTypes.DATE,
       },
       usuario_creo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
       },
       usuario_actualizo_id:{
        allowNull : false,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
       },
       usuario_elimino_id:{
        allowNull : true,
        type      : DataTypes.INTEGER,
        references: { model: 'mg_usuario', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
    }
    

    },
     {    sequelize,
          freezeTableName: true,
          modelName: 'mg_one2many',
          tableName: 'mg_one2many',
          timestamps: false,
          paranoid: true
     })

     mg_one2many.sync({force:false,alter :false})
module.exports = mg_one2many
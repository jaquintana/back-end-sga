
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'



export class mg_many2many extends mg_base{
     
    declare id          : number;
    declare nombre        : string;
    declare nombre_desplegado: string;
    declare padre_id       : number;
    declare modelo_id      : number;
    declare llaveforanea    :string;
 
 }
 

 mg_many2many.init({
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

       tipo: {
        type     : DataTypes.ENUM('TERNARIA','BINARIA'),
        allowNull: false
      },
    modelo_a_id: 
    {  type: DataTypes.INTEGER,
       references: { model: 'mg_modelo', key: 'id' },
       onDelete: 'CASCADE',
       onUpdate: 'CASCADE',
       allowNull:false,
    },
    llave_modelo_a_id:
    {  type: DataTypes.STRING,
        allowNull:false,
    },

    modelo_b_id: 
    {  type: DataTypes.INTEGER,
       references: { model: 'mg_modelo', key: 'id' },
       onDelete: 'CASCADE',
       onUpdate: 'CASCADE',
       allowNull:false,
    },

    llave_modelo_b_id:
    {  type: DataTypes.STRING,
        allowNull:false,
    },

     modelo_c_id:
     {  type: DataTypes.INTEGER,
         allowNull:false,
     },

     llave_modelo_c_id:
     {  type: DataTypes.STRING,
         allowNull:false,
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
          modelName: 'mg_many2many',
          tableName: 'mg_many2many',
          timestamps: false,
          paranoid: true
     })

     mg_many2many.sync({force:false,alter :false})
module.exports = mg_many2many
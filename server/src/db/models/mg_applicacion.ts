
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'




export class mg_aplicacion extends Model{
  
       declare id              : number;
       declare nombre          : string;
       declare configuracion_id: number;
       declare descripcion     : string;
       
}
     mg_aplicacion.init({
     id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },
      configuracion_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      nombre:{
        type: DataTypes.STRING,
        allowNull: true,
      },
       descripcion:
       {
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
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'mg_aplicacion',
            tableName: 'mg_aplicacion',
            timestamps: false,
            paranoid: true
       })

       mg_aplicacion.sync({force:false,alter:false})
module.exports = mg_aplicacion
       


       
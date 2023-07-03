
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import { Model } from 'sequelize';

export interface mg_acceso_x_modelo_interface{
     id      ?: number;
     nombre    ?:string;
     lectura    : boolean;
     escritura   : boolean;
     elimina  : boolean;
     agrega  : boolean;
     activo  ?: boolean;
     grupo_id   ?: number;
     modelo_id?: number;
     descripcion?:string;

}



export class mg_acceso_x_modelo extends Model{
       declare id               : number;
       declare nombre           : string;
       declare descripcion      : string;
       declare nombre_desplegado: string;
       declare lectura          : boolean;
       declare escritura        : boolean;
       declare elimina          : boolean ;
       declare agrega          : boolean;
       declare modelo_id        : number;
       declare grupo_id         :number
       
       
   }
   
  
   mg_acceso_x_modelo.init({
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
     descripcion: {
          type: DataTypes.STRING
        },
     abstract:
     {
        type: DataTypes.BOOLEAN
      },
     nombre_desplegado:
     {
        type: DataTypes.STRING
      },
      lectura:
       {
        type     : DataTypes.ENUM('S','N'),
       },
      escritura:{
        type     : DataTypes.ENUM('S','N'),
       },
      elimina:{
        type     : DataTypes.ENUM('S','N'),
       },
      agrega:{
        type     : DataTypes.ENUM('S','N'),
       },  
       
     modelo_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'mg_modelo', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      
      grupo_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'mg_grupo', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
            modelName: 'mg_acceso_x_modelo',
            tableName: 'mg_acceso_x_modelo',
            timestamps: false,
            paranoid: true
       })

mg_acceso_x_modelo.sync({force: false, alter: false})
module.exports = mg_acceso_x_modelo
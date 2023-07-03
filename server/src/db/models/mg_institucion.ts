
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
//import { mg_modelo } from '../herencia/base.model';
import { Model } from 'sequelize';
import moment from 'moment-timezone';

export class mg_institucion extends Model{
  
       declare nombre              : string
       declare favicon           : string
       declare logo              : string
       declare telefono             : string
       declare movil            : string
       declare correo             : string
       declare activo            : boolean
       declare basedatos       : number

   }
   
  
   mg_institucion.init({
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
     favicon: {
          type: DataTypes.STRING
        },
      logo: {
          type: DataTypes.STRING
        },
      telefono:{
          type: DataTypes.STRING
        },
      movil:{
          type: DataTypes.STRING
        },  
      correo: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 128],
            msg: 'Email address must be between 6 and 128 characters in length'
          },
       isEmail: {
            msg: 'Email address must be valid'
          }
        }
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
        defaultValue:moment().tz("America/Guatemala").toDate()
       },
       fecha_eliminado:{
        allowNull: true,
        type     : DataTypes.DATE,
       },
       fecha_creado:{
        allowNull: false,
        type     : DataTypes.DATE,
        defaultValue:moment().tz("America/Guatemala").toDate()
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
       }
   ,
   usuario_elimino_id:{
    allowNull : true,
    type      : DataTypes.INTEGER,
    references: { model: 'mg_usuario', key: 'id' },
    onDelete  : 'CASCADE',
    onUpdate  : 'CASCADE'
   },
      
      
      basededatos:{
        type: DataTypes.INTEGER.UNSIGNED,
        
      },
      
           },
       {   sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName: 'mg_institucion',
            tableName: 'mg_institucion',
            timestamps: false,
            paranoid: true
       })

       mg_institucion.sync({force: false,alter:false})
module.exports = mg_institucion
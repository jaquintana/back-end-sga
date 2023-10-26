
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
//import { mg_modelo } from '../herencia/base.model';
import { Model } from 'sequelize';
import moment from 'moment-timezone';

export class drsc_denuncia_persona  extends Model{
      declare id                  : number;
      declare nombre              : string;
      declare activo              : string
      declare eliminado           : string
      declare fecha_creado        : Date;
      declare fecha_actualizado   : Date;
      declare fecha_eliminado     : Date;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number
   }
   
   drsc_denuncia_persona.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      },

    persona_id:{
             type         : DataTypes.INTEGER,
            allowNull    : true,
    },
    alerta_id:{
        type         : DataTypes.STRING,
        allowNull    : true,
     },
    situacion:{
        type         : DataTypes.INTEGER,
        allowNull    : true,

    },
    antejuicio:{
        type         : DataTypes.STRING,
        allowNull    : true,
        
    },
    condenatoria:{
        type         : DataTypes.STRING,
        allowNull    : true,
    },
    acusaciones:{
        type         : DataTypes.STRING,
        allowNull    : true,
    },
    aprensiones:{
        type         : DataTypes.STRING,
        allowNull    : true,
    },
    cant_sanciones:{
        type         : DataTypes.INTEGER,
        allowNull    : true,
    },
    monto_sancionado:{
        type         : DataTypes.DOUBLE,
        allowNull    : true,
    },
    funcionario_sancionado:
    {
        type         : DataTypes.INTEGER,
        allowNull    : true,
    },
    denuncias_penales:
    {
        type         : DataTypes.INTEGER,
        allowNull    : true,
    },
    puesto_labora:
    {
        type         : DataTypes.STRING,
        allowNull    : true,
    },
    dependencia_labora:
    {
        type         : DataTypes.STRING,
        allowNull    : true,
    },
    categoria_puesto_labora:{
        type         : DataTypes.STRING,
        allowNull    : true,

    },

    activo: {
          type: DataTypes.ENUM('S','N'),
          allowNull: true,
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
          allowNull: false,
          type     : DataTypes.INTEGER,
          references: { model: 'mg_usuario', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          defaultValue:1
         },
         usuario_actualizo_id:{
          allowNull: false,
          type     : DataTypes.INTEGER,
          references: { model: 'mg_usuario', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          defaultValue:1
         },
         usuario_elimino_id:{
          allowNull: true,
          type     : DataTypes.INTEGER,
          references: { model: 'mg_usuario', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
         }
    
 
     },
       {  sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'drsc_denuncia_persona',
            tableName      : 'drsc_denuncia_persona',
            timestamps     : false,
            paranoid       : true
       })
    
       drsc_denuncia_persona.sync({force:true , alter: true})
module.exports = drsc_denuncia_persona
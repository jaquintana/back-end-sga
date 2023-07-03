
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'
import moment from 'moment-timezone';
//import { mg_modelo } from '../herencia/base.model'

export class drsc_lugar_donde_sucedio  extends Model{
      declare id           : number
      declare alerta       :number
      declare tipo         :string
      declare nombre       :string
      declare departamento_id :number
      declare municipio_id    :number
      declare ubicacion    :string
      declare descripcion  :string
      declare activo        : string
      declare eliminado     :string;
      declare fecha_creado  : Date;
      declare fecha_actualizado: Date;
      declare fecha_eliminado  : Date;
      declare usuario_creo_id:number
      declare usuario_actualizo_id:number
      declare usuario_elimino_id:number    

   }
   
   drsc_lugar_donde_sucedio.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    alerta_id:{
      type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'drsc_alerta', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
   
     nombre: {
          type: DataTypes.STRING(1),
          allowNull: false
        },
     departamento_id:{
               type: DataTypes.INTEGER,
               allowNull: true,
        /*       references: { model: 'mg_cat_departamento', key: 'id' },
               onDelete: 'CASCADE',
                onUpdate: 'CASCADE'*/
     },
     municipio_id:{
      type: DataTypes.INTEGER,
      allowNull: true,
   /*   references: { model: 'mg_cat_municipio', key: 'id' },
      onDelete: 'CASCADE',
       onUpdate: 'CASCADE'*/
},



     ubicacion:{
        allowNull: false,
        type: DataTypes.STRING,
     },

     descripcion:{
        allowNull: false,
        type: DataTypes.STRING,
     },
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
         allowNull: false,
         type     : DataTypes.INTEGER,
         references: { model: 'mg_usuario', key: 'id' },
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE'
        },
        usuario_actualizo_id:{
         allowNull: false,
         type     : DataTypes.INTEGER,
         references: { model: 'mg_usuario', key: 'id' },
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE'
        },
        usuario_elimino_id:{
         allowNull: true,
         type     : DataTypes.INTEGER,
         references: { model: 'mg_usuario', key: 'id' },
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE'
        }

    },
    { 
        hooks:{
            beforeCreate: (async (instance,record) => {
              instance.fecha_creado = new Date(moment().tz("America/Guatemala").format())
            }),
            beforeUpdate:(async (instance, options) => {
              instance.fecha_actualizado = new Date(moment().tz("America/Guatemala").format())
              
               if (instance.eliminado=='S'&& instance.previous.name=='N')
                 instance.fecha_eliminado = new Date(moment().tz("America/Guatemala").format())
            }),
           } ,
         sequelize,
            freezeTableName: true,
            modelName: 'drsc_lugar_donde_sucedio',
            tableName: 'drsc_lugar_donde_sucedio',
            timestamps: false,
            paranoid: true
       })

       drsc_lugar_donde_sucedio.sync({force: false, alter: false})
       module.exports =drsc_lugar_donde_sucedio
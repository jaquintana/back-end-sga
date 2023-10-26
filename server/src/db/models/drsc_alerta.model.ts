
import { DataTypes} from 'sequelize'
import { sequelize} from '../../config/connection'
import {  Model  } from 'sequelize'

import moment from 'moment-timezone';





export interface drsc_i_alerta{
   id                  : string;
   entidad             : string;
   tipo_alerta         : string;
   anio                : number;
   correlativo         : number;
   form_id             : number;
   fecha_alerta        : Date;
   fecha_registro      : Date;
   fecha_documento     : Date;
   medio_enterado_id   : number
   que_sucedio         : string;
   como_sucedio        : string;
   entidad_alertada_id : number;
   dependencia_alertada: string;
   comision            : string;
   identificada_id     : string;
   fecha_inserta       : Date;
   fecha_actualiza     : Date;
   fecha_elimina       : Date;
   activo              : string;
   eliminado           : string;
   usuario_creo_id     : number;
   usuario_actualizo_id: number;
   usuario_elimino_id  : number;
   admisibilidad_id    :number;

}


export class drsc_alerta  extends Model{
      declare id                  : string;
      declare entidad             : string;
      declare tipo_alerta         : string;
      declare anio                : number;
      declare correlativo         : number;
      declare form_id             : number;
      declare fecha_alerta        : Date;
      declare fecha_registro      : Date;
      declare fecha_documento     : Date;
      declare medio_enterado_id   : number
      declare que_sucedio         : string;
      declare como_sucedio        : string;
      declare entidad_alertada_id : number;
      declare dependencia_alertada: string;
      declare comision            : string;
      declare identificada_id     : string;
      declare fecha_inserta       : Date;
      declare fecha_actualiza     : Date;
      declare fecha_elimina       : Date;
      declare activo              : string;
      declare eliminado           : string;
      declare usuario_creo_id     : number;
      declare usuario_actualizo_id: number;
      declare usuario_elimino_id  : number;
      declare admisibilidad_id    :number;
      declare resolucion_tramite  :string
      

            

   }
   
  // numero de alerta cpcc-d-2023-1.., 
  //direccion de recepcion y seguimiento de corrupcion. drsc

  drsc_alerta.init({

    id:{
      type        : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey  : true,
      allowNull   : false,
  },
    form_id: {
      type     : DataTypes.INTEGER,
      allowNull: false,
     },
      fecha_alerta:{
        allowNull: false,
        type     : DataTypes.DATE,
     },
      fecha_registro:{
        allowNull: false,
        type     : DataTypes.DATE,
      },
      fecha_documento:{
        allowNull: true,
        type     : DataTypes.DATE,
      },
      admisibilidad_id:{
        allowNull: true,
        type     : DataTypes.INTEGER,
      },
   /*   medio_enterado_id:{
        allowNull: true,
        defaultValue:0,
        type     : DataTypes.INTEGER,
        references: { model: 'drsc_cat_medio', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
      },*/
      comision:{
        allowNull: false,
        type     : DataTypes.STRING,
      },
      identificada_id:{
            allowNull : false,
            defaultValue:0,
            type      : DataTypes.INTEGER,
            references: { model: 'drsc_cat_identificada', key: 'id' },
            onDelete  : 'CASCADE',
            onUpdate  : 'CASCADE'
            
      },
      origen_id:{
        allowNull: false,
        defaultValue:0,
        type     : DataTypes.INTEGER,
        references: { model: 'drsc_cat_origen', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
      },
      entidad_alertada_id:{
        allowNull: false,
        defaultValue:0,
        type     : DataTypes.INTEGER,
        references: { model: 'drsc_cat_institucion', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
      },
      dependencia_alertada:{
        allowNull: true,
        type     :  DataTypes.TEXT('long'),
      },
      que_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },
      como_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },
      cuando_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },
      donde_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },
      municipio_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.STRING,
      },
      victima_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },
      descripcion_sucedio: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },

      resolucion_tramite: 
      {
        allowNull: true,
        type     : DataTypes.TEXT('long'),
      },


      seguimiento_denuncia: 
      {
        allowNull: false,
        defaultValue:'N',
        type     : DataTypes.ENUM('S','N'),
      },
      institucion_denuncia: 
      {
        allowNull: true,
        type     : DataTypes.INTEGER
      },
      otra_institucion_denuncia: 
      {
        allowNull: true,
        type     : DataTypes.STRING
      },
      numero_referencia_denuncia: 
      {
        allowNull: true,
        type     : DataTypes.STRING
      },
      forma_conocio_plataforma: 
      {
        allowNull: false,
        type     : DataTypes.INTEGER,
        defaultValue:0,
        references: { model: 'drsc_cat_plataforma_difusion', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
      },
      tipo_alerta_id:{
        allowNull: false,
        type     : DataTypes.INTEGER,
        references: { model: 'drsc_cat_tipo_alerta', key: 'id' },
        onDelete  : 'CASCADE',
        onUpdate  : 'CASCADE'
      },

     anio:{
        allowNull: false,
        type     : DataTypes.INTEGER,
      },
     correlativo:{
        allowNull: false,
        type     : DataTypes.INTEGER,
     },
     activo:{
      allowNull: false,
      type     : DataTypes.ENUM('S','N'),
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
    },
    estado:{
      allowNull: false,
      type     : DataTypes.TINYINT,
     },

     buzon:{
        allowNull: true,
        type     : DataTypes.STRING,
        //defaultValue:"recepcion@recepcion.re"
     },

     razonamiento_estado:{
      allowNull: true,
      type     : DataTypes.STRING,
      //defaultValue:"recepcion@recepcion.re"
     },
     observaciones_generales:{
      allowNull: true,
      type     : DataTypes.STRING,
      //defaultValue:"recepcion@recepcion.re"
     },
     criterio_admisibilidad_id:{
      allowNull: true,
      type     : DataTypes.INTEGER,
      //defaultValue:"recepcion@recepcion.re"
     },
     medio_enterado_id:{
      allowNull: true,
      type     : DataTypes.INTEGER,
      //defaultValue:"recepcion@recepcion.re"
     },
     pais_id:{
      allowNull: true,
      type     : DataTypes.STRING,
      defaultValue:''
     },
     depto_estado_id:{
     allowNull: true,
      type     : DataTypes.INTEGER,
      //defaultValue:"recepcion@recepcion.re"
     },
     municipio_id:{
      allowNull: true,
       type     : DataTypes.INTEGER,
       //defaultValue:"recepcion@recepcion.re"

     }

     },
       
      { 
          hooks:{
              beforeCreate: (async (instance,record) => {
                instance.fecha_inserta = new Date(moment().tz("America/Guatemala").format())
              }),
              beforeUpdate:(async (instance, options) => {
                instance.fecha_actualiza = new Date(moment().tz("America/Guatemala").format())
                
                 if (instance.eliminado=='S'&& instance.previous.name=='N')
                   instance.fecha_elimina = new Date(moment().tz("America/Guatemala").format())
              }),
             } ,
              sequelize,
         //   indexes: [{unique: true, fields: ['email']}],  
            freezeTableName: true,
            modelName      : 'drsc_alerta',
            tableName      : 'drsc_alerta',
            timestamps     : false,
            paranoid       : false,
       })
       
       
       drsc_alerta.sync({force: false, alter: true})
module.exports = drsc_alerta
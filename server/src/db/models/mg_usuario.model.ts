// src/models/user.ts

import {createJWToken} from '../../config/auth'
import { DataTypes, Model, Optional } from 'sequelize'
//import  sequelizeConnection  from '../connection'
import { sequelize } from '../../config/connection'
import { mg_base } from './0_base_base.model'
import * as bcrypt from 'bcrypt'
import { now } from 'moment-timezone'
import { arrayBuffer } from 'stream/consumers'


export interface mg_usuario_type{
  id                 :number,
  correo             : string,
  nombre             : string,
  primer_apellido    : string,
  segndo_apellido    : string,
  movil              : string,
  telefono:string;
  contrasena         : string,
  resetToken        : Date,
  resetTokenExpireAt: Date,
  resetTokenSentAt  : Date,
  activo            : boolean,
  institucion_id    : number,
  empleado          : boolean,
  puesto_organizacional_id:number,
  unidad_organizacional_id:number
}


export class mg_usuario extends mg_base{
  
       declare correo             : string
       declare nombre         : string
       declare primer_apellido          : string
       declare segundo_apellido          : string
       declare avatar            : string
       declare movil             : string
       declare contrasena          : string
       declare resetToken        : Date
       declare resetTokenExpireAt: Date
       declare resetTokenSentAt  : Date
       declare activo            : string
       declare institucion_id        : number
    //   declare empleado          : boolean
       
       

      //declare co+untry_id       : number m2o --sys_jl_country
      //declare city_id          : m2m -- sys_jl_city 
      //declare companies_id     : m2m --- sys_jl_company
      //declare group_ids        : m2m --- sys_jl_groups
           
       
       generateToken() {
            
            return createJWToken({ correo: this.correo, id: this.id})
         }

       authenticate(value) {
          if (bcrypt.compareSync(value, this.contrasena))
            return this
          else
            return false
        }
    
      

   }
  
  mg_usuario.init({
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
      primer_apellido: {
          allowNull: false,
          type: DataTypes.STRING
        },
        segundo_apellido: {
          allowNull: true,
          type: DataTypes.STRING
        },  
      avatar: {
          type: DataTypes.STRING
        },
      movil:{
          type: DataTypes.STRING
        },
        contrasena: {
          allowNull: false,
          type: DataTypes.STRING,
          validate: {
            notEmpty: true,
          }
        },

        status:{
          type: DataTypes.ENUM('ONLINE','OFFLINE','BLOCK','WAIT','OTHER'),
          defaultValue:"OFFLINE",
          allowNull:false
        },  
      telefono:{
          type: DataTypes.JSON,
          allowNull: false,
          get() {
            let val=this.getDataValue("telefono")
            if (val)
            return (JSON.parse(val));
            else
            return null
          }, 
          set(value) {
            return this.setDataValue("telefono",JSON.stringify(value));
          }
      },
      
        aut_en_dos_pasos:
        {
          allowNull: false,
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        acceso_jerarquico:
        {
          allowNull: false,
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        periodo_cambio_contrasena:
        {
          allowNull: false,
          type: DataTypes.BOOLEAN,
          defaultValue:false
        },
        
     resetToken: {
        type: DataTypes.STRING
      },
      resetTokenSentAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: true
        }
      },
      resetTokenExpireAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: true
        }
      },
      correo: {
        allowNull: false,
        type: DataTypes.STRING,
     /*   unique: {
          msg: 'Validation error for Artists w.r.t length',
          name: 'unique'
        },*/
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

     tipo_identificacion:{
     allowNull: true,
     type: DataTypes.INTEGER,
     } ,

     identificacion:{
       allowNull: true,
       type: DataTypes.INTEGER,
     },
      unidad_organizacional_id:{
        allowNull: true,
        type: DataTypes.INTEGER,

      }, 
      puesto_organizacional_id:{
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      empleado:{
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'N'
      },
      eliminado:{
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'N'
      },
      institucion_id:{
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: 'mg_institucion', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      terminos:{
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false   
      },
      activo: {
        type     : DataTypes.ENUM('S','N'),
        allowNull: false,
        defaultValue:'S'
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
            indexes: [{unique: true, fields: ['correo']}],  
            freezeTableName: true,
            timestamps: false,
            paranoid: true,
            modelName: 'mg_usuario',
            tableName: 'mg_usuario',
            defaultScope: {
              attributes: {
                exclude: ['contrasena']
              },
              
            },
            scopes: {
              withContrasena: {
                attributes: {
                  include: ['contrasena']
                }
              }
            },
            
           
            hooks: {
              beforeCreate:((user)=>{
                user.nombre = user.nombre.toLowerCase();
                user.primer_apellido  = user.primer_apellido.toLowerCase();
                user.activo='S';
              }),
              beforeSave:((user, options) => {
                if (user.changed('contrasena')) {
                  user.contrasena = bcrypt.hashSync(user.contrasena, bcrypt.genSaltSync(10))
                  
                }
              }),

              beforeUpdate:((user, options) => {
                if (user.changed('contrasena')) {
                  console.log("before Update a",user['dataValues'])
                  user.contrasena = bcrypt.hashSync(user['_previousDataValues']['contrasena'], bcrypt.genSaltSync(10))
                }
              })

        
            }
            
     
       }
      
       )
   
    mg_usuario.sync({force:false,alter:false})
    module.exports = mg_usuario
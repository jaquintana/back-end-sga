
import { DataTypes,Sequelize} from 'sequelize'
import { sequelize} from '../../config/connection'
import  {mg_base} from './0_base_base.model'

export class drsc_alerta_persona extends mg_base{
  declare id:number;
  declare alerta_id:string;
  declare tipo_actividad_id:number; //m2o
  
}


drsc_alerta_persona.init({
  id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false,
  },
  alerta_id: {
      type: DataTypes.STRING,
      allowNull: false
  },
  primer_nombre: {
    type: DataTypes.STRING,
    allowNull: true
},
segundo_nombre: {
    type: DataTypes.STRING,
    allowNull: true
},
paterno_apellido: {
    type: DataTypes.STRING,
    allowNull: true
},
materno_apellido: {
    type: DataTypes.STRING,
    allowNull: true
},
alias: {
    type: DataTypes.STRING,
    allowNull: true
},
fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: true
},
cui: {
    type: DataTypes.STRING,
    allowNull: true
},
telefono: {
    type: DataTypes.STRING,
    allowNull: true
},

direccion: {
    type: DataTypes.STRING,
    allowNull: true
},
correo: {
    type: DataTypes.STRING,
    allowNull: true
},

institucion_labora: {
    type: DataTypes.TEXT('long'),
    allowNull: true
},
dependencia_labora: {
    type: DataTypes.TEXT('long'),
    allowNull: true
},
puesto_cargo_labora: {
    type: DataTypes.STRING,
    allowNull: true
},
ubicacion_labora: {
    type: DataTypes.TEXT('long'),
    allowNull: true
},
genero: {
  type     : DataTypes.ENUM('M','F'),
  allowNull: true
}  ,
etnia: {
    type     : DataTypes.INTEGER,
    allowNull: true
  } ,
comunidad_linguistica:{
    type     : DataTypes.INTEGER,
    allowNull: true

},

tipo_persona:{
    type     : DataTypes.INTEGER,
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
        modelName: 'drsc_alerta_persona',
        tableName: 'drsc_alerta_persona',
        timestamps: false,
        paranoid: true
   })

   drsc_alerta_persona.sync({force:false, alter:false})
module.exports = drsc_alerta_persona
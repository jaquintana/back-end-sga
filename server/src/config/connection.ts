

import { Sequelize } from 'sequelize'
//import { createRequire } from "module";
import {environment} from './'

//const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config();

export const sequelize : any= new Sequelize(environment.dbName,environment.dbUser,environment.dbPassword,{
  host:environment.dbHost,
  dialect:environment.dbDriver,

  port:environment.dbport,
  logging: false,
  timezone: '-06:00'
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err : any)=> {
    console.error('Unable to connect to the database:', err)
  })

/*export const sequelizeConnection = new Sequelize(dbName, dbUser,dbPassword, {
    host: dbHost,
    dialect: 'mysql',
    port:Number(dbport)
  });*/
  

//sequelizeConnection.authenticate()

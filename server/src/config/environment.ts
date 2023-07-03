import { Dialect } from 'sequelize'
require('dotenv').config()
module.exports = {
  development: {
    dbName : process.env.DB_NAME as string,
    dbUser : process.env.DB_USER as string,
    dbHost : process.env.DB_HOST,
    dbDriver: process.env.DB_DRIVER,
    dbPassword : process.env.DB_PASSWORD,
    secret:  process.env.SECRET,
    dbport: process.env.DB_PORT
  },
  test: {
   dbName : process.env.DB_NAME as string,
   dbUser : process.env.DB_USER as string,
   dbHost : process.env.DB_HOST,
   dbDriver: process.env.DB_DRIVER,
   dbPassword : process.env.DB_PASSWORD,
   secret:  process.env.SECRET,
   dbport: process.env.DB_PORT
  },
  production: {
   dbName : process.env.DB_NAME as string,
   dbUser : process.env.DB_USER as string,
   dbHost : process.env.DB_HOST,
   dbDriver: process.env.DB_DRIVER,
   dbPassword : process.env.DB_PASSWORD,
   secret:  process.env.SECRET,
   dbport: process.env.DB_PORT
  }
 }

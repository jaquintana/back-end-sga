import "reflect-metadata";
import express, { Request, Response } from "express";
//import { createRequire } from "module";
import  cors from 'cors'
import { Express } from 'express'
import * as routes  from './src/api/routes/routes'
const i18n = require('./i18n.config');
const path= require('path');
var cookieParser = require('cookie-parser')






const dotenv = require('dotenv');
dotenv.config();

const port=process.env.PORT

export class Server {
  private app: Express;
  
  
  constructor(){
    
            i18n.setLocale('es-419')
            this.app = express()
            this.app.use(express.json());
            this.app.use(cors())
            this.app.use(express.urlencoded({ extended: true }))
            this.app.use(i18n.init)
            this.app.use(cookieParser())
            this.app.use('/public', express.static(path.join(__dirname, '/public')))
            console.log("dirname",__dirname)
            console.log(i18n.__('English'))
          
/*test*/



          process.on('', function (err) {
            console.error('UnhandledPromiseRejectionWarning');
            console.error(err.stack);
          });
      
          try {
            this.app.listen(port, async () => {
                console.log("dirname",__dirname)
                console.log(port,"---Proyecto Comision.Server started on por http://api.apijunla.com:3001");
  
            });
          } catch (error) {
            console.error(error);
            process.exit(1);
          }
         routes.initRoutes(this.app)
  }
  
}  


new Server()



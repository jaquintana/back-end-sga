import "reflect-metadata";
import express, { Application,Request, Response } from "express";
const path= require('path');
import  cors from 'cors'
import * as bodyParser from 'body-parser'
const fileUpload = require('express-fileupload')

//import sequelizeConnection from "./db/connection"
//var cors = require('cors')

const app: Application = express()
const port=3000

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(bodyParser.json())
app.use(cors())
app.use('/public', express.static(path.join(__dirname, '/public')))



/*app.use((req, resp, next) => {
  next()
}, cors({ maxAge: 84600 }))*/

app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Sequelize Example 🤟" });
});

const start = async (): Promise<void> => {
  try {
    app.listen(port, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
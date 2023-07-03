import { Express, Request, Response } from 'express'
import * as apiRoutes from './api.routes'
import * as adminRoutes from './admin.routes'
import * as express from 'express'
var subdomain = require('express-subdomain')



export function initRoutes(app: Express) {

  app.use(subdomain('api', apiRoutes.initRoutes(app, express.Router())))
  app.use(subdomain('admin', adminRoutes.initRoutes(app, express.Router())))
  app.get('/', (req : any, res:any) => res.status(200).send({message: 'Welcome to IMFO world'}))
  app.all('*', (req: Request, res: Response) => {
    res.json('not founc'),req})
}

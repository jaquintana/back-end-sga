import {ApplicationController,DatabaseByName} from './application.controller'
import { UsersController } from './users.controller'
import { CompanyController } from './company.controller'
import { RegistrationController } from './registration.controller'
import { SessionController } from './session.controller'
import { ActionController } from './action.controller'
import { ActionUrlController } from './action.controller'
import { ActionMenuController } from './action.controller'
import { formsDatabaseController } from './forms.database.controller'
import { ActionServerController } from './action.server.controller'


export {ApplicationController,
       DatabaseByName,
       CompanyController,
       UsersController, RegistrationController, SessionController,ActionController,ActionMenuController,
       ActionUrlController,formsDatabaseController,ActionServerController}


       
// var fs = require('fs');
// function getUrl(url) {
//   return '/api' + url;
// }
// let routes = {}
// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js')
//   })
//   .forEach(function(file){
//     let name = file.replace('.js', '')
//     let controller = require(__dirname + '/' + name)
//     routes[name] = new controller()
//   })
//
// module.exports = routes


import {CompanyController,
   UsersController,
    RegistrationController,
     SessionController,
     ActionController,
     ActionUrlController,
    ActionMenuController,
    formsDatabaseController,
    ActionServerController
  } from '../controllers'

  const CtrlMain=require('../controllers/temp/temp')

  'use strict';
  
  var multer  = require('multer')
  var upload = multer()
 




export function initRoutes(app, router) {
  
  let apiRoute = router

  const users = new UsersController()
  const registration = new RegistrationController()
  
  const session = new SessionController()
  const company = new CompanyController()
  const actionform = new ActionController()
  const actionServer= new ActionServerController()
  const actionUrl= new ActionUrlController()
  const actionMenu= new ActionMenuController()
  const formDatabase= new formsDatabaseController()
  


   
    apiRoute.get('/', (req:any, res:any) => res.status(200).send({message: 'Api Server is running!'}))
    apiRoute.post('/api/signin', session.signin.bind(session))
    apiRoute.post('/api/signout', session.signout.bind(session))
    apiRoute.post('/api/valsesion', session.valsesion.bind(session),function (res, resp) {
      
       return res.json(resp)
    })
    apiRoute.post('/api/signup', registration.signup.bind(registration),function (res, resp) {
      return res.json(resp)
    })

    /*apiRoute.post('/api/signout', registration..bind(registration),function (res, resp) {
      return res.json(resp)
    })*/

    apiRoute.post('/api/actionform', actionform.actionForm.bind(actionform),function (res, resp) {
      return res.json(resp)
    })
    apiRoute.post('/api/actionmenu', actionMenu.actionMenu.bind(actionMenu),function (res, resp) {
      return res.json(resp)
    })
    

    apiRoute.post('/api/actionurl', actionUrl.actionUrl.bind(actionUrl),function (res, resp) {
      return res.json(resp)
    })

    apiRoute.post('/api/accionserver', actionServer.actionServer.bind(actionServer),function (res, resp) {
      //return res.json(resp)
    })

    apiRoute.post('/api/datalist', actionform.dataList.bind(actionServer),function (res, resp) {
      return res.json(resp)
    })

    apiRoute.get('/confirmation/:token', registration.confirmation.bind(registration),function (res, resp) {
      return res.json(resp)
    })
    
    apiRoute.post('/getcompanies',company.findAllCompanies.bind(company),function (req,res, resp) {
        return res.json(resp)
    })

   router.post('/api/putuserimage', upload.array('images[]',2), function (req, res, next) {
    console.log("xxx")
      CtrlMain.saveMediaUserImages(2,req, res, (err, resp) => {
         if (err) next(err)
            return res.json(resp)
     })
   })

   router.post('/api/updtformserver',formDatabase.updtModel.bind(formDatabase),function (req, res, resp) {
    console.log("xxx")
    return res.json(resp)
   })

     apiRoute.post('/api/createchildformserver',formDatabase.createChildModel.bind(formDatabase),function(req,res,resp){
      return res.json(resp)
     })

     apiRoute.post('/api/getDataChildFormById/read',actionform.getDataChildFormById.bind(actionform),function(req,res,resp){
  
      
     }) 

      
    apiRoute.get('/api/users/',  users.list)
    return apiRoute
}

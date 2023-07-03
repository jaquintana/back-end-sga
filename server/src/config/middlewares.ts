import {verifyJWTToken} from './auth'
import db from '../db/models/index'


export function verifyJWT_MW(req : any, res:any, next:any) {
   if (req.headers && req.headers['x-access-token']) {

    verifyJWTToken(req.headers['x-access-token']).then((decode:any) => {
      db['User'].findOne({where: {email: decode['email'], id: decode['id']}}).then(function (user:any) {
          if (!user) {
            req.user = undefined
            next()
          } else {
            req.user = user
            next()
          }
        }).catch(function (err:any) {
          req.user = undefined
          next()
        })
    }).catch((err) => {
      res.status(400).json({message: 'Invalid auth token provided.'})
    })
  }else {
    req.user = undefined
    return res.status(401).json({ success: false , message: 'Unauthorized user!' })
  }
}

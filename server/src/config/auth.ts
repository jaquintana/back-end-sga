
import { strict } from 'assert'
import * as jwt from 'jsonwebtoken'
require('dotenv').config()

export function verifyJWTToken(token:any) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET|| '', (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      }
      resolve(decodedToken)
    })
  })
}

export function createJWToken(payload:any) {
  return jwt.sign({
    data: payload
  }, process.env.SECRET || '', {
    expiresIn: 3600,
    algorithm: 'HS256'
  })
}

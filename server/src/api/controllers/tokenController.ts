'use strict'

import { now } from "lodash"

const jwt= require ('jwt-simple')
const moment= require('moment')
const fs= require('fs')
const path = require('path')



export class tokenController 

{

 stringrandom() {

        const len = 32
        let random = ''
        for (let i = 0; i < len; i++) {
            const str = Math.floor((Math.random() * 10) + 1)
            random += str
        }
        return random
    }
    

 readFile() {
  const data= new Promise(function (resolve, reject) {
      fs.readFile(path.join((__dirname),'\\private.key').trim(), 'utf8', function (err, privateKey) {
            if (err){
                 reject(err)
            }
             else{
                 resolve(privateKey);
             }   
        });
    });
  return data
}

 createToken(user){
  
  var resultado
    const payload={
    sub: user._id,
    iat:moment(), //moment().unix(),
    exp:moment().add(5,'hours') //.unix()
  }
 
    var valor= this.readFile()
    .then( function (privateKey){
            resultado=jwt.encode(payload,privateKey)
                    return(resultado)
          })     
            .catch( err=>{
                return err
         })
    
    return {valor,payload}
}

 returnToken(token){
  var privateKey
 
  var valor= this.readFile()
  .then( function (response){
         
          privateKey=response
          
            const resultado = jwt.decode(token, privateKey)
            
          
                if ( resultado.exp< moment().unix())
                    return false
            else{  
                 return(resultado)
              }
        }).catch( err=>{
          return false
        })
 
     return valor
      }

 returnPassToken(token){
        var privateKey
       
        var valor= this.readFile()
        .then( function (response){
               
                privateKey=response
       
                  const resultado = jwt.decode(token, privateKey)
        
                  return(resultado)
               
              }).catch( err=>{
        
                return false
              })
       
           return valor
            }


   decodeToken(token){
   var privateKey

   var valor= this.readFile()
  .then( function (response){
         
          privateKey=response
         
            const resultado = jwt.decode(token, privateKey)
  
                if ( resultado.exp< moment().unix()){
             
                  return false
           } else{  
  
               return(true)
              }
        }).catch( err=>{
  
          return false
        })
 
     return valor
    }

}  
    
import { Request, Response, NextFunction } from 'express';
import {tokenController} from '../api/controllers/tokenController'
import db from '../db/models/index'

     
       

  export const checkJwt = async (req, res, next: NextFunction) => {
        // Get the JWT from the request header.
        var _result:any;
        const token = <string>req.headers['authorization'];
        console.log("req.body-JWT",req.headers)
    
        // Validate the token and retrieve its data.
        try {
            // Verify the payload fields.
            let _tokenController=new tokenController()
            if (!req.headers.authorization)
             return res.status(200).json({success: false, code:"TOKEN03", error: 'Error, el token no es valido, verifique el header.authorization',sesion:null})                 
            const key=req.headers.authorization.split(" ")
            const usuario=req.body.id;
            const token=key[1];
            const tokenValido=await _tokenController.decodeToken(token)
            const _result=await db["mg_sesion"].findAll({raw:true,where:{activo:1,usuario_id:usuario}})
            if ( tokenValido){
                console.log("error Handler",_result)
             //   return res.status(200).json({success: false, code:"TOKEN01", error: 'el token no es valido',sesion:_result[0].id })             
             console.log("next token valido",tokenValido)
             next();
            }   
            else return res.status(200).json({success: false, code:"TOKEN01", error: 'el token no es valido',sesion:_result[0].id})                 

        } catch (error) {
            console.log("_session",_result,error)
            if (_result)
            return res.status(200).json({success: false, code:"TOKEN01", error: 'el token no es valido',sesion:_result[0].id})                 
            else
            return res.status(200).json({success: false, code:"TOKEN02", error: 'el token no es valido',sesion:null})                 
            
        }
    };
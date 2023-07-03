const nodemailer           = require('nodemailer');
const { google }           = require("googleapis");
const OAuth2               = google.auth.OAuth2;

import {tokenController} from './tokenController'

const oauth2Client = new OAuth2(
    '259397006075-phaj4t1grd4dlfb4nt5llgbpcvm3hmgf.apps.googleusercontent.com', // ClientID
    "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", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);


  export class mailUser{

     _tokenController:any
     _idRegister:any
     _email:any

     constructor(email:string){
         this._email=email;
       
     }
    
     async sendConfirmationMail(){
        this._tokenController=new tokenController()
        oauth2Client.setCredentials({
           refresh_token: '1//04RxJs0rASeMfCgYIARAAGAQSNwF-L9Irj2hDBliPDCFn_OzsTL5msyMgOVN1G7ul-oeFbo0Ew9fqs2llpNJaITvwdClUek4iCPU'
                           
        });
                return await this.setTransporter()    

     }
    
    accesToken() {
        const accessToken = oauth2Client.getAccessToken();
    
        return nodemailer
        .createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                type: 'OAuth2',
                user: "taller.relojeria@fsrichard.com",                                                                                                                                             // Your gmail address.
                clientId: '259397006075-phaj4t1grd4dlfb4nt5llgbpcvm3hmgf.apps.googleusercontent.com',                                                                                                                                                 // Not @developer.gserviceaccount.com
                refreshToken: '1//04RxJs0rASeMfCgYIARAAGAQSNwF-L9Irj2hDBliPDCFn_OzsTL5msyMgOVN1G7ul-oeFbo0Ew9fqs2llpNJaITvwdClUek4iCPU',
                clientSecret: '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',
                accessToken: accessToken,
            }
        })

    } 

    async createToken(pass) {
        return await  this._tokenController.createToken(pass) //.then(token => { return token })
    
    }

    async  setBinnacleMail(){



    }  

    async setTransporter(){

        let _vl_sendMail:any;
        let transporter = await this.accesToken()
        
        let idregister = this._tokenController.stringrandom()
     
        transporter.set('oauth2_provision_cb', (user, renew, callback) => {
          
        });
        let token = await this._tokenController.createToken(idregister)
        token.valor.then(token=>{ 
            
        let mailOptions = {
            from: 'taller.relojeria@fsrichard.com',//user_name, // sender address
            to: this._email,
            subject: 'Confirmación de Cuenta',
            text: 'Confirmacion de cuenta',
            html: ` Junla a enviado este coreo de confirmacion de cuenta. <a href=http://api.apijunla.com:3000/confirmation/${token}> Presione aquí para verificar, Su password temporal es: ${idregister}</a> Gracias. 
                         <p> ${idregister}</p> `
        }
      
       return transporter.sendMail(mailOptions).then(function (info) {
          
            if (info.accepted) {
                return _vl_sendMail = { token:token, code: '000', error: "no", message: `El usuario fue creado se envio el correo ` }
            }
            else {
                return _vl_sendMail = { token:null,code: '002', error: "yes", message: `no se envio el correo ` }
            }
        })
    })
    }
            
            
            

            

         
 
}

import {    formsDatabaseController
} from '../../controllers'
import { agrega_documento} from '../../procedimientos/documento_x_alerta/documento_x_alerta'


const path = require('path');
var fs = require('fs');

async function salvarDocumentImage(req, res, next) {
    const agregaDocumento= new agrega_documento()
    try {
    
        var _index = req.body.indice
        const obj1=JSON.parse(req.body.Data,req.files)
       if (req.files) {
            let arrayImage = _index.split(",");
            if (arrayImage){
                for (let i = 0; i <= arrayImage.length - 1; i++) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    var tempname = uniqueSuffix + req.files[i].originalname
                    var targetPath = path.join('D:/desarrollo/proyecto_comision_backend/server/public/') + tempname;
                    var realpath = 'public/' + tempname;
                    console.log("realpath",realpath)
                    var outStream = fs.createWriteStream(targetPath);
                    outStream.write(req.files[i].buffer);
                    outStream.end();
                   //req
                   for (let i=0;i<obj1.set_id.length;i++){
                    Object.keys(obj1.set_id[i]).forEach(key=>{ 
                         console.log("key",key)
                         if (key=='ubicacion_documento')
                           obj1.set_id[i][key]=realpath
                        })
                     } 
                    console.log("obj1",obj1)  
                    req.body=obj1
                    agregaDocumento.BuscaAgregaDocumentoImagen(res,req.body)
                   } 
                }
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ status: "no", message: `saveMediaUserImages--` + error })
    }
}

async function actualizaDocumentImage(req, res, next) {
    var originalPath
    const agregaDocumento= new agrega_documento()
     
      console.log("actualiza",req.body,req.files)
    try {
    
        var _index = req.body.indice
        const obj1=JSON.parse(req.body.Data)

        

        if (req.files) {
            let arrayImage = _index.split(",");
            console.log("array images",arrayImage)
            if (arrayImage){
                for (let i = 0; i <= arrayImage.length - 1; i++) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    var tempname = uniqueSuffix + req.files[i].originalname
                    var targetPath = path.join('D:/desarrollo/proyecto_comision_backend/server/public/') + tempname;
                    obj1.ubicacion_archivo_ant? originalPath=path.join('D:/desarrollo/proyecto_comision_backend/server/public/') + obj1.ubicacion_archivo_ant:originalPath=null
                    
                    var realpath = 'public/' + tempname;
                    console.log("realpath",realpath)
                    var outStream = fs.createWriteStream(targetPath);
                    outStream.write(req.files[i].buffer);
                    outStream.end();
                    console.log("originpath",originalPath,obj1)
                    if (originalPath){
                        
                        fs.exists(originalPath, function (exists) {
                            console.log("sxists",exists)
                            if (exists) 
                                fs.unlink(originalPath);
                            
                         });
                    }
                    
                   console.log("obje",obj1)
                   for (let i=0;i<obj1.set_id.length;i++){
                    Object.keys(obj1.set_id[i]).forEach(key=>{ 
                         console.log("key",key)
                         if (key=='ubicacion_documento')
                           obj1.set_id[i][key]=realpath
                        })
                     } 
                    console.log("obj1",obj1)  
                    req.body=obj1
                    let result=await agregaDocumento.BuscaActualizaDocumento(res,req.body)
                    console.log("resulttota",result)
                    return res.status(200).send(result)
                   } 
                   
                    
                }
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ status: "no", message: `saveMediaUserImages--` + error })
    }

}


async function saveMediaUserImages(req, res, next) {
    const formDatabase= new formsDatabaseController()
     console.log("req.body-2",req.body.indice)
    
    try {
    
        var _index = req.body.indice
        const obj1=JSON.parse(req.body.Data)


        if (req.files) {
            let arrayImage = _index.split(",");
            if (arrayImage)
                for (let i = 0; i <= arrayImage.length - 1; i++) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    var tempname = uniqueSuffix + req.files[i].originalname
                    var targetPath = path.join('D:/desarrollo/proyecto_comision_backend/server/public/') + tempname;
                    var realpath = 'public/' + tempname;
                    var outStream = fs.createWriteStream(targetPath);
                    outStream.write(req.files[i].buffer);
                    outStream.end();
                   req

                   if (obj1.length>0){
                        obj1[0].change.map(item=> {if (item['avatar']) item['avatar']=realpath })
       

                    req.body=obj1
                     formDatabase.updtModel(req,res)
                   } 
                   
                    
                }
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ status: "no", message: `saveMediaUserImages--` + error })
    }

}
module.exports = { saveMediaUserImages ,salvarDocumentImage,actualizaDocumentImage}
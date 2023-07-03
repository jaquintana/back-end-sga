import {    formsDatabaseController
} from '../../controllers'
const path = require('path');
var fs = require('fs');

async function saveMediaUserImages(typeid, req, res, next) {
    const formDatabase= new formsDatabaseController()

    
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
                        console.log("nodo",obj1[0].change)

                    req.body=obj1
                    console.log("obj1",obj1)
                    formDatabase.updtModel(req,res)
                   } 
                   
                    
                }
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ status: "no", message: `saveMediaUserImages--` + error })
    }

}
module.exports = { saveMediaUserImages }
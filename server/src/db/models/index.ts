import { SlowBuffer } from 'buffer'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
const basename = path.basename(module.filename)
import { sequelize } from '../../config/connection'

let db:any = {}
fs
  .readdirSync(__dirname)
  .filter(function(file) {
  
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts')
  })
  .forEach(function(file) {
  
    const modelPath = path.join(__dirname,file);
    const model= require(modelPath) 
    
    db[model['name']] = model
    
  })

Object.keys(db).forEach(function(modelName) {
  
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
 

})

db['sequelize'] = sequelize
db['Sequelize'] = Sequelize

export default db

/*import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
const basename = path.basename(module.filename)
import { sequelize } from '../../config/connection'

let db:any = {}
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts')
    
  })   .forEach(function(file) {
        
        const modelPath = path.join(__dirname,file);
        const model= require(modelPath) 
        

  })  

export default db*/
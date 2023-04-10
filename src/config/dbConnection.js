require('dotenv').config()
let { MongoClient } = require('mongodb')
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_dbname = process.env.MONGO_DBNAME

var url=`mongodb+srv://${mongo_username}:${mongo_password}@recipeapp.2tcdzkr.mongodb.net/RecipeApp?retryWrites=true&w=majority`
const client=new MongoClient(url)

let dbname

module.exports.connect=()=>{

    try{
        client.connect()
        console.log('Connection Successful')
        dbname = mongo_dbname
    }catch(e){
        console.log(e)
    }
}

module.exports.get=()=>{
    return client.db(dbname)
}


let express = require("express")
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
let db = require('../config/dbConnection')
let collection =  require('../config/collection')
require('dotenv').config()

const jwtToken = process.env.JWT_TOKEN

let router = express.Router()

router.post("/register",async (req,res)=>{
    const {username, password} = req.body
    let user =await db.get().collection(collection.USER_COLLECTION).findOne({username:username})
    
    if(user){
        return res.json({message:"user already exists!"})
    }else{
        const hashPassword = await bcrypt.hash(password,15)
        db.get().collection(collection.USER_COLLECTION).insertOne({username:username,password:hashPassword,savedRecipes:[]})
        return res.json({message:"user created succesfully.."})
    }
})


router.post("/login",async(req,res)=>{
    const {username,password} = req.body
    const user = await db.get().collection(collection.USER_COLLECTION).findOne({username:username})

    if(!user){
        res.json({message:"User don't exist!"})
    }else{
        const isPasswordValid =await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
           return res.json({message:"Password is wrong!",validPassword:false})
        }else{
            const token = jwt.sign({id:user._id},jwtToken)
            res.json({token,userID:user._id,validPassword:true})
        }
    }
})

module.exports = router

module.exports.verifyToken=(req,res,next)=>{
    const token = req.headers.authorization
    if(token){
        jwt.verify(token,jwtToken,(err)=>{
            if(err){
                return res.sendStatus(403)
            }else{
                next()
            }
        })
    }else{
        res.sendStatus(401)
    }
}



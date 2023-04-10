var express = require('express')
var db = require('../config/dbConnection')
var collection = require('../config/collection')
var objID = require('mongodb')
var { verifyToken } = require('./user')

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const recipeList = await db.get().collection(collection.RECIPE_COLLECTION).find().toArray()
        res.json(recipeList)
    } catch (error) {
        res.json(error)
    }
})

router.post("/", verifyToken,async (req, res) => {
    const { name, ingredients, instructions, cookingTime, userOwner } = req.body

    try {
        await db.get().collection(collection.RECIPE_COLLECTION).insertOne({
            name: name,
            ingredients: ingredients,
            instructions: instructions,
            cookingTime: cookingTime,
            userOwner: userOwner
        })
        res.json("Recipe create successfuly..!")
    } catch (error) {
        res.json(error)
    }
})

router.put("/", verifyToken,async (req, res) => {
    var userId = req.body.userID
    userId = new objID.ObjectId(userId)
    var recipeId = req.body.recipeID
    recipeId = new objID.ObjectId(recipeId)

    try {

        const recipe = await db.get().collection(collection.RECIPE_COLLECTION).findOne({ _id: recipeId })
        await db.get().collection(collection.USER_COLLECTION).updateOne(
            { _id: userId },
            { $push: { savedRecipes: recipe._id } }
        )
        const user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: userId })
        res.json({ savedRecipes: user.savedRecipes })
    } catch (error) {
        console.log(error)
    }
})

router.get("/saverRecipes/ids/:userID", async (req, res) => {
    var userId = req.params.userID
    userId = new objID.ObjectId(userId)

    try {
        const user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: userId })
        res.json({ savedRecipes: user?.savedRecipes })
    } catch (error) {
        res.json(error)
    }
})

router.get("/saverRecipes/:userID", async (req, res) => {
    var userId = req.params.userID
    userId = new objID.ObjectId(userId)

    try {
        const user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: userId })
        const savedRecipes = await db.get().collection(collection.RECIPE_COLLECTION).find({
            _id: { $in: user.savedRecipes }
        }).toArray()
        res.json({ savedRecipes })
    } catch (error) {
        res.json(error)
    }
})

module.exports = router
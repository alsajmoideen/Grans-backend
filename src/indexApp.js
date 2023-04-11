let  express = require('express')
let cors = require('cors')
require('dotenv').config()
let db = require('./config/dbConnection')
var userRouter = require('./routes/user')
var recipeRouter = require('./routes/recipe')

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use(cors())

app.use('/auth', userRouter)
app.use('/recipes',recipeRouter)


db.connect()

app.listen(PORT,()=>console.log('SERVER START AT PORT: '+PORT))
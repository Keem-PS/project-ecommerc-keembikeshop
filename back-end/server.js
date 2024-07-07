const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const userController = require('./controllers/UserController')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //get form
app.use(cors()) // commutication with front-end

app.use('/user', userController);

app.listen(3001);
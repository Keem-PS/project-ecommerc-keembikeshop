const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const userController = require('./controllers/UserController')
const ProductController = require('./controllers/ProductController')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) //get form
app.use(cors()) // commutication with front-end
app.use('/uploads', express.static('uploads'))

app.use('/user', userController)
app.use('/product', ProductController)

app.listen(3001)
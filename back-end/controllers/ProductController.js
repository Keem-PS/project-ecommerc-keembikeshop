const express = require('express')
const app = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { isAwaitExpression } = require('typescript')

dotenv.config()

app.post('/create', async (req, res) => {
    try { 
        const result = await prisma.product.create({
            data: req.body
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.get('/list', async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            orderBy: {
                id: 'desc'
            }
        })

        res.send({ results: data })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})


module.exports = app
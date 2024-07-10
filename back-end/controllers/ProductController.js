const express = require('express')
const app = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const exceljs = require('exceljs')

dotenv.config()
app.use(fileUpload())

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
            },
            where: {
                status: 'use'
            }
        })

        res.send({ results: data })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.delete('/remove/:id', async (req, res) => {
    try {
        await prisma.product.update({
            data: {
                status: 'delete'
            },
            where: {
                id: parseInt(req.params.id)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.put('/update', async (req, res) => {
    try {
        const fs = require('fs')
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(req.body.id)
            }
        })

        // remove old image
        const imagePath = './uploads/' + oldData.img

        if (fs.existsSync(imagePath)) {
            await fs.unlinkSync(imagePath)
        }
        
        await prisma.product.update({
            data: req.body,
            where: {
                id: parseInt(req.body.id)
            }
        })

        res.send({ message: 'success'})
    } catch (e) {
        res.status(500).send({ error: e.message })

    }
})

app.post('/upload', async (req,res) => {
    try {
        if (req.files != undefined) {
            if (req.files.img != undefined ) {
                const img = req.files.img
                const fs = require('fs')
                const myData = new Date()
                const y = myData.getFullYear()
                const m = myData.getMonth()
                const d = myData.getDate()
                const h = myData.getHours()
                const mi = myData.getMinutes()
                const s = myData.getSeconds()
                const ms = myData.getMilliseconds()

                const arrFileName = img.name.split('.')
                const ext = arrFileName[arrFileName.length - 1]

                const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`

                img.mv('./uploads/' + newName, (err) => {
                    if (err) throw err

                    res.send({ newName: newName })
                })

            } else {
                res.status(501).send('notimplemented')
            }
        }
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.post('/uploadFormExcel', (req, res) => {
    try {
        const fileExcel = req.files.fileExcel
        
        fileExcel.mv('./uploads' + fileExcel.name, async (err) => {
            if (err) throw err

            // read from file and inset to database
            const workbook = new exceljs.Workbook()
            await workbook.xlsx.readFile('./uploads' + fileExcel.name)

            const ws = workbook.getWorksheet(1)

            for (let i = 2; i <= ws.rowCount; i++) {
                const name = ws.getRow(i).getCell(1).value ?? "" // if null of undefined return ""
                const cost = ws.getRow(i).getCell(2).value ?? 0 // if null of undefined return 0
                const price = ws.getRow(i).getCell(3).value ?? 0 // if null of undefined return 0

                if (name != "" && cost >= 0 && price >= 0) {
                    await prisma.product.create({
                        data: {
                            name: name,
                            cost: cost,
                            price: price,
                            img: ''
                        }
                    })
                }
            }

            // remove file from server
            const fs = requrie('fs')
            await fs.unlinkSync('./uploads/' + fileExcel.name)

            res.send({ message: 'success' })
        })
    } catch (e) {
        res.status(500).send({ error: e.message })

    }
})


module.exports = app
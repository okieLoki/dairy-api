require('dotenv').config()
const express = require('express')
const dbConnect = require('./config/db')
const authUserRoute = require('./routes/authUserRoute')
const rateListRoute = require('./routes/rateListRoute')
const farmerRoute = require('./routes/farmerRoute')

dbConnect()

const server = express()
server.use(express.json())

server.use('/api/user', authUserRoute)
server.use('/api/ratelist', rateListRoute)
server.use('/api/farmer', farmerRoute)

module.exports = server
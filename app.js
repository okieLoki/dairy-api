require('dotenv').config()
const express = require('express')
const dbConnect = require('./config/db')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

dbConnect()

const server = express()
server.use(express.json())
server.use(cors())

server.use('/api/user', userRoute)
server.use('/api/admin', adminRoute)

module.exports = server
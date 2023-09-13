require('dotenv').config()
const express = require('express')
const dbConnect = require('./config/db')
const cors = require('cors')
const path = require('path')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')

// Database connection
dbConnect()

try{
  dbConnect()
}catch(err){
  console.log('Error while connecting to the DB')
}

const server = express()

// Cors
server.use(cors())

// Middleware
server.use(express.json())
server.use(express.static('public'))

// Template engine
server.set('views', path.join(__dirname, '/views'))
server.set('view engine', 'ejs');


server.use('/api/user', userRoute)
server.use('/api/admin', adminRoute)

module.exports = server

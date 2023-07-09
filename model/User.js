const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email missing']
    },
    name: {
        type: String,
        required: [true, 'First Name missing']
    },
    password: {
        type: String,
        required: [true, 'Password missing']
    },
    token: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
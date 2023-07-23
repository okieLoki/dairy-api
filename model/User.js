const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    phoneNo: {
        type: Number,
        unique: true,
        required: [true, 'Phone Number missing'],
        minlength: 10,
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
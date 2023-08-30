const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name missing'],
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minLength: 8
    },
    maxUsers: {
        type: Number,
        required: [true, 'Max users required'],
    },
    maxFarmers: {
        type: Number,
        required: [true, 'Max users required'],
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date required'],
    },
    token: {
        type: String
    },
    tokenGeneratedForgotPassword: {
        type: Boolean,
        default: false
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
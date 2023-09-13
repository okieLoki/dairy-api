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
    resetPasswordToken: {
        type: String,
        default: null, // Initialize it as null
    },
    resetPasswordTokenExpires: {
        type: Date,
        default: null, // Initialize it as null
    },
    token: {
        type: String,
    }
}, {
    timestamps: true
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
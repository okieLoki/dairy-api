const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true,
        required: [true, 'User ID missing'],
    },
    username: {
        type: String,
        required: [true, 'User name missing']
    },
    password: {
        type: String,
        required: [true, 'Password missing'],
        minLength: 8,
    },
    mobileNo: {
        type: Number,
    },
    contactPerson: {
        type: String,
    },
    address: {
        type: String,
    },
    permissions: {
        allowAddFarmer: { type: String, default: 'Not Allow', enum: ['Allow', 'Not Allow'] },
        allowLedger: { type: String, default: 'Not Allow', enum: ['Allow', 'Not Allow'] },
        allowPayment: { type: String, default: 'Not Allow', enum: ['Allow', 'Not Allow'] },
        allowRateChart: { type: String, default: 'Not Allow', enum: ['Allow', 'Not Allow'] },
        allowDues: { type: String, default: 'Not Allow', enum: ['Allow', 'Not Allow'] },
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Admin ID missing'],
        ref: 'Admin'
    },
    timezone: {
        type: String,
        default: 'Asia/Kathmandu',
    },
    token: {
        type: String
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
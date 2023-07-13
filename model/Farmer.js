const mongoose = require('mongoose')

const rateListSchema = new mongoose.Schema({
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID missing'],
        unique: true
    },
    rfid: {
        type: String,
    },
    mobileNumber: {
        type: Number,
        required: [true, 'Mobile Number missing'],
    },
    farmerName: {
        type: String,
        required: [true, 'Name missing'],
    },
    farmerLevel : {
        type: Number,
        required: [true, 'Level missing'],
        enum: [1, 2, 3, 4]
    },
    paymentMode: {
        type: String,
        required: [true, 'Payment Mode missing'],
        enum: ['CASH', 'CHEQUE', 'BANK']
    },
    bankName: {
        type: String
    },
    accountNumber: {
        type: Number
    },
    bankHolderName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID missing'],
        ref: 'User'
    },
    dues: {
        type: Number,
        default: 0
    }
})

const Farmer = mongoose.model('Farmer', rateListSchema)

module.exports = Farmer
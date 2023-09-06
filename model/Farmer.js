const mongoose = require('mongoose')

const farmerSchema = new mongoose.Schema({
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID missing'],
    },
    farmerName: {
        type: String,
        required: [true, 'Farmer name is missing']
    },
    mobileNumber: {
        type: Number,
        required: [true, 'Mobile Number missing'],
    },
    farmerName: {
        type: String,
        required: [true, 'Name missing'],
    },
    farmerLevel: {
        type: Number,
        required: [true, 'Level missing'],
        enum: [1, 2, 3, 4, 5]
    },
    fixedRate: {
        type: Number,
        required: function () {
            return this.farmerLevel === 5
        }
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
    debit: {
        type: Number,
        default: 0
    },
    credit: {
        type: Number,
        default: 0
    }
})

farmerSchema.index({ farmerId: 1, userId: 1 }, { unique: true });

const Farmer = mongoose.model('Farmer', farmerSchema)

module.exports = Farmer
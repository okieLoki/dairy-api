const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID missing'],
    },
    date: {
        type: Date,
        required: [true, 'Date missing'],
    },
    qty: {
        type: Number
    },
    fat: {
        type: Number
    },
    snf: {
        type: Number
    },
    shift: {
        type: String,
    },
    credit: {
        type: Number,
        default: 0
    },
    debit: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
        enum: ['Collection', 'Payment', 'Other']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID missing'],
        ref: 'User'
    },
})

const Ledger = mongoose.model('Ledger', ledgerSchema)

module.exports = Ledger
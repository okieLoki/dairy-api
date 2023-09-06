const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID missing'],
    },
    farmerName: {
        type: String,
        required: [true, 'Farmer name is missing']
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
        enum: ['Morning', 'Evening'],
    },
    credit: {
        type: Number,
        default: 0
    },
    debit: {
        type: Number,
        default: 0
    },
    previousBalance: {
        type: Number,
        default: 0
    },
    remarks: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID missing'],
        ref: 'User'
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }
})

const Ledger = mongoose.model('Ledger', ledgerSchema)

module.exports = Ledger
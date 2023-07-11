const mongoose = require('mongoose')

const collectionSchema = mongoose.Schema({
    farmerId: {
        type: String,
        required: [true, 'Farmer ID missing'],
        ref: 'Farmer'
    },
    collectionDate: {
        type: Date,
        default: Date.now(),
        required: [true, 'Collection Date missing'],
    },
    qty: {
        type: Number,
        required: [true, 'Quantity missing'],
    },
    fat: {
        type: Number,
        required: [true, 'FAT missing'],
    },
    snf: {
        type: Number,
        required: [true, 'SNF missing'],
    },
    rate: {
        type: Number,
        required: [true, 'Rate missing'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount missing']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection
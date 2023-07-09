const mongoose = require('mongoose')

const rateListSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Type missing'],
        enum: ['KGFAT + KGSNF', 'KGFAT ONLY', 'FAT ONLY', 'FAT + SNF']
    },
    level : {
        type: Number,
        required: [true, 'Level missing'],
        enum: [1, 2, 3, 4]
    },
    rateChartName: {
        type: String,
        required: [true, 'Rate Chart Name missing']
    },
    animal : {
        type: String,
        required: [true, 'Animal missing'],
        enum: ['COW', 'BUFFALO', 'BOTH']
    },
    ratio : {
        type: String,
        required: [true, 'Ratio missing'],
        enum: ['60:40', '52: 48', '50:50']
    },
    fat: {
        type: Number,
        required: [true, 'Fat missing']
    },
    snf: {
        type: Number,
        required: [true, 'SNF missing']
    },
    rate: {
        type: Number,
        required: [true, 'Rate missing']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id missing'],
        ref: 'User'
    }
})

const RateList = mongoose.model('RateList', rateListSchema)

module.exports = RateList
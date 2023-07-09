const mongoose = require('mongoose')

const rateListSchema = new mongoose.Schema({
    rateChartName: {
        type: String,
        required: [true, 'Rate Chart Name missing']
    },
    level : {
        type: String,
        required: [true, 'Level missing']
    },
    fat: {
        type: Number,
        required: [true, 'Fat missing']
    },
    snf: {
        type: Number,
        required: [true, 'SNF missing']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id missing'],
        ref: 'User'
    }
})

const RateList = mongoose.model('RateList', rateListSchema)

module.exports = RateList
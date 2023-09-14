const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: [true, 'User ID missing'],
    },
    username: {
        type: String,
        required: [true, 'User name missing']
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person missing']
    },
    date: {
        type: Date,
        required: [true, 'Date missing']
    },
    shift: {
        type: String,
        required: [true, 'Shift missing'],
        enum: ["Morning", "Evening"],
    },
    totalMilk: {
        type: Number,
        required: [true, 'Total milk missing']
    },
    avgFat: {
        type: Number,
        required: [true, 'Average fat missing']
    },
    avgSNF: {
        type: Number,
        required: [true, 'Average SNF missing']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount missing']
    },
    tempMilk : {
        type: Number,
        default: 0,
    },
    tempFat : {
        type: Number,
        default: 0,
    },
    tempSNF : {
        type: Number,
        default: 0,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Admin ID missing'],
        ref: 'Admin'
    },
}, {
    timestamps: true
}
)

reportSchema.index({ date: 1, username: 1, shift: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema)

module.exports = Report
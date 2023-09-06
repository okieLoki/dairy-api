const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({
    farmerId: {
        type: Number,
        required: [true, 'Farmer ID is missing']
    },
    farmerName: {
        type: String,
        required: [true, 'Farmer name is missing']
    },
    date: {
        type: Date,
        required: [true, 'Date is missing']
    },
    amountToPay: {
        type: Number,
        required: [true, 'Amount to pay is missing']
    },
    remarks: {
        type: String,
        required: [true, 'Remarks is missing']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is missing']
    }
})

const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment
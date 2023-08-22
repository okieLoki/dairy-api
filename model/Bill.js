const mongoose = require('mongoose')

const BillSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        default: "Hamroo Dairy",
    },
    contactNumber1: {
        type: Number,
        default: 9805421247
    },
    contactNumber2: {
        type: Number,
        default: 9857027462
    },
    address: {
        type: String,
        default: "Address"
    },
    panNumber: {
        type: Number,
        default: 614075025
    },
    billTitle: {
        type: String,
        default: "Bill"
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
})

const Bill = mongoose.model('Bill', BillSchema)
module.exports = Bill
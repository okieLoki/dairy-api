const jwt = require('jsonwebtoken')
const Bill = require("../model/Bill")

const addBillDetails = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const admin_id = decoded.admin_id

        const bill = new Bill({
            organizationName: req.body.organizationName,
            contactNumber1: req.body.contactNumber1,
            contactNumber2: req.body.contactNumber2,
            address: req.body.address,
            panNumber: req.body.panNumber,
            billTitle: req.body.billTitle,
            adminId: admin_id
        })

        await bill.save()

        res.status(201).send(bill)
    }
    catch (e) {
        res.status(400).send({ error: e.message })
    }
}

const getBillDetails = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const admin_id = decoded.admin_id

        const bill = await Bill.findOne({ adminId: admin_id })

        if (!bill) {
            return res.status(400).send({ error: "Bill details not found" })
        }

        res.status(200).send(bill)
    }
    catch (e) {
        res.status(400).send({ error: e.message })
    }
}

const updateBillDetails = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const admin_id = decoded.admin_id

        const bill = await Bill.findOne({ adminId: admin_id })

        if (!bill) {
            return res.status(400).send({ error: "Bill details not found" })
        }

        bill.organizationName = req.body.organizationName || bill.organizationName
        bill.contactNumber1 = req.body.contactNumber1 || bill.contactNumber1
        bill.contactNumber2 = req.body.contactNumber2 || bill.contactNumber2
        bill.address = req.body.address || bill.address
        bill.panNumber = req.body.panNumber || bill.panNumber
        bill.billTitle = req.body.billTitle || bill.billTitle

        await bill.save()

        res.status(200).send(bill)
    }
    catch (e) {
        res.status(400).send({ error: e.message })
    }
}

module.exports = { addBillDetails, getBillDetails, updateBillDetails }
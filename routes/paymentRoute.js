const express = require('express')
const router = express.Router()
const settlePayment = require('../controller/paymentController')
const auth = require('../middleware/auth')

router.post('/', auth, settlePayment)

module.exports = router
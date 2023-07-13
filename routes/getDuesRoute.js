const express = require('express')
const router = express.Router()
const {getAllDues, settleAllDues, getDuesFarmerId} = require('../controller/duesController')
const auth = require('../middleware/auth')

router.get('/', auth, getAllDues)
router.get('/:farmerId', auth, getDuesFarmerId)
router.post('/settle', auth, settleAllDues)

module.exports = router
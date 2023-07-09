const express = require('express')
const router = express.Router()
const {addFarmer, getAllFarmers} = require('../controller/farmerController')
const auth = require('../middleware/auth')

router.post('/', auth, addFarmer)
router.get('/', auth, getAllFarmers)

module.exports = router
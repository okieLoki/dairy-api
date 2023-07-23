const express = require('express')
const router = express.Router()
const { addFarmer, getAllFarmers, deleteFarmer } = require('../controller/farmerController')
const { auth, admin } = require('../middleware/auth')

router.post('/', auth, addFarmer)
router.delete('/:id', auth, deleteFarmer)
router.get('/', auth, getAllFarmers)

module.exports = router
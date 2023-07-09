const express = require('express');
const router = express.Router();
const { addRateList, getAllRateList } = require('../controller/ratelistController')
const auth = require('../middleware/auth')

router.post('/', auth, addRateList)
router.get('/', auth, getAllRateList)

module.exports = router
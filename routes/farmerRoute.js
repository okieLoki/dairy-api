const express = require('express');
const router = express.Router();
const {authFarmer} = require('../middleware/auth')

const {
    reqOTPFarmer, 
    verifyOTPandLogin,
    getFarmerCollections,
    getCollectionsDaily,
    getCollectionsWeekly,
    getCollectionsMonthly
} = require('../controller/farmerAppController')

router.post('/otp', reqOTPFarmer)

router.use(authFarmer)
router.patch('/otp/verify', verifyOTPandLogin)
router.get('/collections', getFarmerCollections)
router.get('/collections/daily', getCollectionsDaily)
router.get('/collections/weekly', getCollectionsWeekly)
router.get('/collections/monthly', getCollectionsMonthly)

module.exports = router;
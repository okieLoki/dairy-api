const express = require('express');
const router = express.Router();
const {authFarmer} = require('../middleware/auth')

const {
    reqOTPFarmer, 
    verifyOTPandLogin,
    getFarmerCollections,
    getFarmerLedger,
    listProfiles,
    selectProfile
} = require('../controller/farmerAppController')

router.post('/otp', reqOTPFarmer)

router.use(authFarmer)
router.patch('/otp/verify', verifyOTPandLogin)
router.get('/profiles', listProfiles)
router.get('/profile/:id', selectProfile)
router.get('/collections', getFarmerCollections)
router.get('/ledger', getFarmerLedger)

module.exports = router;
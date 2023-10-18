const express = require('express');
const router = express.Router();
const {authFarmer} = require('../middleware/auth')

const {reqOTPFarmer, verifyOTPandLogin} = require('../controller/farmerAppController')

router.post('/otp', reqOTPFarmer)

router.use(authFarmer)
router.patch('/otp/verify', verifyOTPandLogin)

module.exports = router;
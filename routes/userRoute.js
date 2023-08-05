const express = require('express');
const router = express.Router();

const { loginUser, registerUser, getAllUsers } = require('../controller/userController');
const { addFarmerAsUser, getAllFarmers, getLatestFarmerId } = require('../controller/farmerController')
const { getRate, getAllRateList, addRateListByUser } = require('../controller/ratelistController')

const { authAdmin, authUser } = require('../middleware/auth');
const { settlePaymentByUser } = require('../controller/paymentController');
const { getAllLedgerEntriesForRange } = require('../controller/ledgerController');
const { getAllDuesByUser } = require('../controller/duesController');
const { addCollectionByUser, getAllCollectionsForDate, getAverageFat, getAverageSNF, getTotalMilkByUser, getAverageFatByUser, getAverageSNFByUser } = require('../controller/collectionController');

// AUTHENTICATION 
router.post('/login', loginUser)
router.get('/', authAdmin, getAllUsers)
router.post('/signup', authAdmin, registerUser);

// FARMERS ROUTING
router.get('/:username/farmer/latestid/', authUser, getLatestFarmerId)
router.post('/:username/farmer/', authUser, addFarmerAsUser)
router.get('/:username/farmer/', authUser, getAllFarmers)

// RATELIST ROUTING
router.get('/:username/ratelist/:farmerId', authUser, getRate)
router.get('/:username/ratelist', authUser, getAllRateList)
router.post('/:username/ratelist', authUser, addRateListByUser)

// LEDGER ROUTING
router.get('/:username/ledger', authUser, getAllLedgerEntriesForRange)

// PAYMENT ROUTING
router.post('/:username/payment', authUser, settlePaymentByUser)

// COLLECTION ROUTING
router.post('/:username/collection', authUser, addCollectionByUser)
router.get('/:username/collection', authUser, getAllCollectionsForDate)
router.get('/:username/collection/totalmilk', authUser, getTotalMilkByUser)
router.get('/:username/collection/avgfat', authUser, getAverageFatByUser)
router.get('/:username/collection/avgsnf', authUser, getAverageSNFByUser)


// DUES ROUTING
router.get('/:username/dues', authUser, getAllDuesByUser)

module.exports = router;
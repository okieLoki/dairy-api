const express = require('express');
const router = express.Router();

const { loginUser, registerUser, getAllUsers, getUser, deleteUser, getUserPermissions, updateUser } = require('../controller/userController');
const { addFarmerAsUser, getAllFarmers, getLatestFarmerIdByUser } = require('../controller/farmerController')
const { getRate, getAllRateList, addRateListByUser } = require('../controller/ratelistController')

const { authAdmin, authUser } = require('../middleware/auth');
const { settlePaymentByUser } = require('../controller/paymentController');
const { getAllLedgerEntriesForRange } = require('../controller/ledgerController');
const { getAllDuesByUser } = require('../controller/duesController');
const { addCollectionByUser, getAllCollectionsForDate, getTotalMilkByUser, getAverageFatByUser, getAverageSNFByUser, updateCollection, getCollectionById } = require('../controller/collectionController');

// AUTHENTICATION 
router.post('/login', loginUser)
router.post('/signup', authAdmin, registerUser);
router.get('/', authAdmin, getAllUsers)
router.get('/:username', authAdmin, getUser)
router.put('/:username', authAdmin, updateUser)
router.get('/:username/permissions', authAdmin, getUserPermissions)

// FARMERS ROUTING
router.get('/:username/farmer/latestid/', authUser, getLatestFarmerIdByUser)
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
router.put('/:username/collection/:id', authAdmin, updateCollection)
router.get('/:username/collection/:id', authAdmin, getCollectionById)
router.get('/:username/collection/totalmilk', authUser, getTotalMilkByUser)
router.get('/:username/collection/avgfat', authUser, getAverageFatByUser)
router.get('/:username/collection/avgsnf', authUser, getAverageSNFByUser)


// DUES ROUTING
router.get('/:username/dues', authUser, getAllDuesByUser)

module.exports = router;

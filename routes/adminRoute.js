const express = require('express');
const router = express.Router();

const { register, login } = require('../controller/adminController');
const { getAllLedgerEntriesForRangeByAdmin } = require('../controller/ledgerController');
const { addRateList, getAllRateList, getRate, deleteRateList, updateRateListById, getRateListById } = require('../controller/ratelistController');
const { deleteFarmer, addFarmerAsAdmin, getAllFarmers, getLatestFarmerId, updateFarmerById, getFarmerById } = require('../controller/farmerController');
const { settlePaymentByAdmin } = require('../controller/paymentController');
const { getAllDuesByAdmin } = require('../controller/duesController');
const { authAdmin } = require('../middleware/auth');
const { addCollectionByAdmin, getAllCollectionsForDate, getAverageFatByAdmin, getAverageSNFByAdmin, getTotalMilkByAdmin } = require('../controller/collectionController');
const { getBillDetails, addBillDetails, updateBillDetails } = require('../controller/billController');

// AUTHENTICATION 
router.post('/signup', register);
router.post('/login', login)

// FARMERS ROUTING
router.post('/:username/farmer/', authAdmin, addFarmerAsAdmin)
router.delete('/:username/farmer/:id', authAdmin, deleteFarmer)
router.put('/:username/farmer/:id', authAdmin, updateFarmerById)
router.get('/:username/farmer/:farmerId', authAdmin, getFarmerById)
router.get('/:username/farmer/', authAdmin, getAllFarmers)
router.get('/:username/farmer/latestid/', authAdmin, getLatestFarmerId)

// RATELIST ROUTING
router.post('/:username/ratelist', authAdmin, addRateList)
router.get('/:username/ratelist/:id', authAdmin, getRateListById)
router.get('/:username/ratelist/:farmerId/rate', authAdmin, getRate)
router.put('/:username/ratelist/:id', authAdmin, updateRateListById)
router.delete('/:username/ratelist/:id', authAdmin, deleteRateList)
router.get('/:username/ratelist', authAdmin, getAllRateList)

// LEDGER ROUTING
router.get('/:username/ledger', authAdmin, getAllLedgerEntriesForRangeByAdmin)


// PAYMENT ROUTING
router.post('/:username/payment', authAdmin, settlePaymentByAdmin)

// COLLECTION ROUTING
router.post('/:username/collection', authAdmin, addCollectionByAdmin)
router.get('/:username/collection', authAdmin, getAllCollectionsForDate)
router.get('/collection/totalmilk', authAdmin, getTotalMilkByAdmin)
router.get('/collection/avgfat', authAdmin, getAverageFatByAdmin)
router.get('/collection/avgsnf', authAdmin, getAverageSNFByAdmin)

// DUES ROUTING
router.get('/:username/dues', authAdmin, getAllDuesByAdmin)

// BILL DETAILS
router.get('/bill', authAdmin, getBillDetails)
router.put('/bill', authAdmin, updateBillDetails)
router.post('/bill', authAdmin, addBillDetails)


module.exports = router;

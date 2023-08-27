const express = require('express');
const router = express.Router();

const { register, login } = require('../controller/adminController');
const { getAllLedgerEntriesForRangeByAdmin } = require('../controller/ledgerController');
const { addRateList, getRate, deleteRateList, updateRateListById, getRateListById, getAllRateListByAdmin } = require('../controller/ratelistController');
const { deleteFarmer, addFarmerAsAdmin, getAllFarmers, updateFarmerById, getFarmerById, getLatestFarmerIdByAdmin } = require('../controller/farmerController');
const { settlePaymentByAdmin } = require('../controller/paymentController');
const { getAllDuesByAdmin, getPreviousDues } = require('../controller/duesController');
const { authAdmin } = require('../middleware/auth');
const { addCollection, getAllCollectionsForDate, getAverageFatByAdmin, getAverageSNFByAdmin, getTotalMilkByAdmin, updateCollection, getCollectionById } = require('../controller/collectionController');
const { getBillDetails, addBillDetails, updateBillDetails } = require('../controller/billController');

// AUTHENTICATION 
router.post('/signup', register);
router.post('/login', login)

// FARMERS ROUTING
router.post('/:username/farmer/', authAdmin, addFarmerAsAdmin)
router.delete('/:username/farmer/:farmerId', authAdmin, deleteFarmer)
router.put('/:username/farmer/:farmerId', authAdmin, updateFarmerById)
router.get('/:username/farmer/latestid', authAdmin, getLatestFarmerIdByAdmin)
router.get('/:username/farmer/:farmerId', authAdmin, getFarmerById)
router.get('/:username/farmer/', authAdmin, getAllFarmers)

// RATELIST ROUTING
router.post('/:username/ratelist', authAdmin, addRateList)
router.get('/:username/ratelist/:id', authAdmin, getRateListById)
router.get('/:username/ratelist/:farmerId/rate', authAdmin, getRate)
router.put('/:username/ratelist/:id', authAdmin, updateRateListById)
router.delete('/:username/ratelist/:id', authAdmin, deleteRateList)
router.get('/:username/ratelist', authAdmin, getAllRateListByAdmin)

// LEDGER ROUTING
router.get('/:username/ledger', authAdmin, getAllLedgerEntriesForRangeByAdmin)


// PAYMENT ROUTING
router.post('/:username/payment', authAdmin, settlePaymentByAdmin)

// COLLECTION ROUTING
router.post('/:username/collection', authAdmin, addCollection)
router.get('/:username/collection', authAdmin, getAllCollectionsForDate)
router.put('/:username/collection/:id', authAdmin, updateCollection)
router.get('/:username/collection/:id', authAdmin, getCollectionById)
router.get('/collection/totalmilk', authAdmin, getTotalMilkByAdmin)
router.get('/collection/avgfat', authAdmin, getAverageFatByAdmin)
router.get('/collection/avgsnf', authAdmin, getAverageSNFByAdmin)

// DUES ROUTING
router.get('/:username/dues', authAdmin, getAllDuesByAdmin)
router.get('/:username/dues/prev', authAdmin, getPreviousDues)

// BILL DETAILS
router.get('/bill', authAdmin, getBillDetails)
router.put('/bill', authAdmin, updateBillDetails)
router.post('/bill', authAdmin, addBillDetails)


module.exports = router;

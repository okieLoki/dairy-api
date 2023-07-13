const express = require('express')
const router = express.Router()
const { addCollection, getAllCollections } = require('../controller/collectionController')
const auth = require('../middleware/auth')

router.post('/', auth, addCollection)
router.get('/', auth, getAllCollections)

module.exports = router
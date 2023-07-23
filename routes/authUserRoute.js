const express = require('express');
const router = express.Router();

const { register, login } = require('../controller/authController');
const { admin } = require('../middleware/auth');

router.post('/signup', admin, register);
router.post('/login', login)

module.exports = router;

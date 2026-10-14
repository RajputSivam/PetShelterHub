const express = require('express');
const { createDonation } = require('../controllers/donationController');

const router = express.Router();
router.post('/', createDonation);

module.exports = router;
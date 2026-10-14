const express = require('express');
const { createAdoption } = require('../controllers/adoptionController');

const router = express.Router();
router.post('/', createAdoption);

module.exports = router;
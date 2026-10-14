const express = require('express');
const { createVolunteer } = require('../controllers/volunteerController');

const router = express.Router();
router.post('/', createVolunteer);

module.exports = router;
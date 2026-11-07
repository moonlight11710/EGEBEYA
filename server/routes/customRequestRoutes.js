const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequestController');

router.post('/', customRequestController.createCustomRequest);

module.exports = router;


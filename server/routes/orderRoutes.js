const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:code', orderController.getOrderByCode);

module.exports = router;


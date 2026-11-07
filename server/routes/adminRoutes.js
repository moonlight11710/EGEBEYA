const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Public admin login endpoint
router.post('/login', adminController.login);

// All subsequent routes require admin authentication
router.use(requireAdmin);

router.get('/stats', adminController.getStats);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

router.get('/custom-requests', adminController.getCustomRequests);
router.patch('/custom-requests/:id/status', adminController.updateCustomRequestStatus);

router.put('/settings', adminController.updateSettings);

module.exports = router;


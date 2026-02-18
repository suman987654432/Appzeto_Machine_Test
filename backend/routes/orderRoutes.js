const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getVendorOrders, updateOrderStatus } = require('../controllers/orderController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { roleCheck } = require('../middleware/roleMiddleware.js');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/vendororders').get(protect, roleCheck(['vendor']), getVendorOrders);
router.route('/:id/status').put(protect, roleCheck(['vendor', 'admin']), updateOrderStatus);

module.exports = router;

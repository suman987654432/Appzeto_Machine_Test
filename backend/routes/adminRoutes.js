const express = require('express');
const router = express.Router();
const { getVendors, updateVendorStatus, getAdminStats } = require('../controllers/adminController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { roleCheck } = require('../middleware/roleMiddleware.js');

router.route('/vendors').get(protect, roleCheck(['admin']), getVendors);
router.route('/vendors/:id').put(protect, roleCheck(['admin']), updateVendorStatus);
router.route('/stats').get(protect, roleCheck(['admin']), getAdminStats);

module.exports = router;

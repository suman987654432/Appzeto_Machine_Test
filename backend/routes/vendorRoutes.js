const express = require('express');
const router = express.Router();
const { getVendorProfile, updateVendorProfile } = require('../controllers/vendorController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { roleCheck } = require('../middleware/roleMiddleware.js');

router.route('/me').get(protect, roleCheck(['vendor']), getVendorProfile);
router.route('/profile').put(protect, roleCheck(['vendor']), updateVendorProfile);

module.exports = router;

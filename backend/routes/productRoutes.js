const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { roleCheck } = require('../middleware/roleMiddleware.js');

// Public
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Vendor Only
router.route('/').post(protect, roleCheck(['vendor']), createProduct);
router.route('/:id').put(protect, roleCheck(['vendor']), updateProduct).delete(protect, roleCheck(['vendor']), deleteProduct);

module.exports = router;

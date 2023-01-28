// Imports
const express = require('express');
const { getAllProducts, createProduct, getAllIkeaProducts, getAllProductsStatic } = require('../controllers/products');

// Router
const router = express.Router();

// Routes
// Get all products
router.get('/', getAllProducts); // or router.route('/').get(getAllProducts);
router.get('/ikea', getAllIkeaProducts);
router.get('/static', getAllProductsStatic); // or router.route('/static').get(getAllProductsStatic);
// Create product
router.post('/', createProduct);

// Export
module.exports = router;
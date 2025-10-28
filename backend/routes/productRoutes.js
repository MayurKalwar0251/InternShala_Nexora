/**
 * Product Routes
 * Defines all routes for product-related operations
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories
} = require('../controllers/productController');

// @route   GET /api/products
// @desc    Get all products with optional limit and sort
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/categories/all
// @desc    Get all available categories
// @access  Public
router.get('/categories/all', getCategories);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

module.exports = router;
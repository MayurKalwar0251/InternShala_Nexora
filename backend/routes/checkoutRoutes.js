/**
 * Checkout Routes
 * Defines all routes for checkout and receipt operations
 */

const express = require('express');
const router = express.Router();
const {
  processCheckout,
  getReceipts,
  getReceiptByNumber,
  getReceiptsByEmail
} = require('../controllers/checkoutController');

// @route   POST /api/checkout
// @desc    Process checkout and create receipt
// @access  Public
router.post('/', processCheckout);

// @route   GET /api/checkout/receipts
// @desc    Get all receipts (with optional email filter)
// @access  Public
router.get('/receipts', getReceipts);

// @route   GET /api/checkout/receipts/email/:email
// @desc    Get receipts by email
// @access  Public
router.get('/receipts/email/:email', getReceiptsByEmail);

// @route   GET /api/checkout/receipt/:receiptNumber
// @desc    Get single receipt by receipt number
// @access  Public
router.get('/receipt/:receiptNumber', getReceiptByNumber);

module.exports = router;
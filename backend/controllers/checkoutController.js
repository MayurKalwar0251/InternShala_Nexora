/**
 * Checkout Controller
 * Handles checkout process and receipt generation
 */

const Receipt = require("../models/Receipt");
const Cart = require("../models/Cart");

/**
 * @desc    Process checkout and create receipt
 * @route   POST /api/checkout
 * @access  Public
 */
const processCheckout = async (req, res, next) => {
  try {
    const { cartItems, name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Please add items before checkout.",
      });
    }

    // Calculate totals
    let subtotal = 0;
    const receiptItems = cartItems.map((item) => {
      const itemSubtotal = item.price * item.qty;
      subtotal += itemSubtotal;

      return {
        productId: item.productId,
        title: item.title,
        price: item.price,
        qty: item.qty,
        subtotal: itemSubtotal,
      };
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Create receipt
    const receipt = await Receipt.create({
      name,
      email,
      items: receiptItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: "completed",
    });

    // Clear cart after successful checkout
    await Cart.deleteMany({});

    // Send success response
    res.status(201).json({
      success: true,
      message: "Checkout successful",
      receipt: {
        receiptNumber: receipt.receiptNumber,
        name: receipt.name,
        email: receipt.email,
        items: receipt.items,
        subtotal: receipt.subtotal,
        tax: receipt.tax,
        total: receipt.total,
        timestamp: receipt.createdAt,
        status: receipt.status,
      },
    });
  } catch (error) {
    console.error("Error processing checkout:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching receipts by email",
    });
  }
};

/**
 * @desc    Get all receipts (order history)
 * @route   GET /api/checkout/receipts
 * @access  Public
 */
const getReceipts = async (req, res, next) => {
  try {
    const { email, limit = 10 } = req.query;

    let query = {};
    if (email) {
      query.email = email.toLowerCase();
    }

    const receipts = await Receipt.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    console.error("Error fetching receipts:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching receipts",
    });
  }
};

/**
 * @desc    Get single receipt by receipt number
 * @route   GET /api/checkout/receipt/:receiptNumber
 * @access  Public
 */
const getReceiptByNumber = async (req, res, next) => {
  try {
    const { receiptNumber } = req.params;

    const receipt = await Receipt.findOne({ receiptNumber });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("Error fetching receipt:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching receipt",
    });
  }
};

/**
 * @desc    Get receipts by email
 * @route   GET /api/checkout/receipts/email/:email
 * @access  Public
 */
const getReceiptsByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    const receipts = await Receipt.find({
      email: email.toLowerCase(),
    }).sort({ createdAt: -1 });

    if (receipts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No receipts found for this email",
      });
    }

    res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    console.error("Error fetching receipts by email:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while",
    });
  }
};
module.exports = {
  processCheckout,
  getReceipts,
  getReceiptByNumber,
  getReceiptsByEmail,
};

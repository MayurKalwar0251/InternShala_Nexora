const Cart = require("../models/Cart");
const axios = require("axios");

/**
 * @desc    Add item to cart with session ID
 * @route   POST /api/cart
 * @access  Public
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1, sessionId } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check if product already exists in THIS USER's cart
    let cartItem = await Cart.findOne({ productId, sessionId });

    if (cartItem) {
      // Update quantity if item already exists
      cartItem.qty += qty;
      cartItem.subtotal = cartItem.price * cartItem.qty;
      await cartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        data: cartItem,
      });
    }

    // Fetch product details from Fake Store API
    const productResponse = await axios.get(
      `https://fakestoreapi.com/products/${productId}`
    );

    if (!productResponse.data) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productResponse.data;

    // Create new cart item with session ID
    cartItem = await Cart.create({
      sessionId,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      qty,
      subtotal: product.price * qty,
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};

/**
 * @desc    Get cart items for specific session
 * @route   GET /api/cart/:sessionId
 * @access  Public
 */
const getCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Get cart items for this session only
    const cartItems = await Cart.find({ sessionId }).sort({ createdAt: -1 });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Public
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qty, sessionId } = req.body;

    // Validate quantity
    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Find cart item and verify it belongs to this session
    const cartItem = await Cart.findOne({ _id: id, sessionId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found or does not belong to this session",
      });
    }

    cartItem.qty = qty;
    cartItem.subtotal = cartItem.price * qty;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cartItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while updating cart item",
    });
  }
};

/**
 * @desc    Delete cart item
 * @route   DELETE /api/cart/:id
 * @access  Public
 */
const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Find and verify ownership
    const cartItem = await Cart.findOne({ _id: id, sessionId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found or does not belong to this session",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while deleting cart item",
    });
  }
};

/**
 * @desc    Clear entire cart for session
 * @route   DELETE /api/cart/clear/:sessionId
 * @access  Public
 */
const clearCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Delete only this session's cart items
    await Cart.deleteMany({ sessionId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
};

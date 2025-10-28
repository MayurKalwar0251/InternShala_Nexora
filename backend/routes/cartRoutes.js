const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = require("../controllers/cartController");

// Get cart items for specific session
router.get("/:sessionId", getCart);

// Add item to cart
router.post("/", addToCart);

// Update cart item quantity
router.put("/:id", updateCartItem);

// Remove specific item from cart
router.delete("/:id", deleteCartItem);

// Clear entire cart for session
router.delete("/clear/:sessionId", clearCart);

module.exports = router;

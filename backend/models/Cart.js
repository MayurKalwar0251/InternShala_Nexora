const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, "Session ID is required"],
      index: true, // Index for faster queries
    },
    productId: {
      type: Number,
      required: [true, "Product ID is required"],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      default: "general",
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      default: function () {
        return this.price * this.qty;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Calculate subtotal before saving
cartItemSchema.pre("save", function (next) {
  this.subtotal = this.price * this.qty;
  next();
});

// Compound index for sessionId + productId (prevent duplicates per session)
cartItemSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartItemSchema);

module.exports = Cart;

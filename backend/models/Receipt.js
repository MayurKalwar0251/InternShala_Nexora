/**
 * Receipt Model
 * Mongoose schema for storing checkout receipts in MongoDB
 * Captures customer information, order details, and transaction data
 */

const mongoose = require('mongoose');

const receiptItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: false });

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  items: [receiptItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  paymentMethod: {
    type: String,
    default: 'mock_payment'
  }
}, {
  timestamps: true
});

// Index for faster queries
receiptSchema.index({ email: 1, createdAt: -1 });
receiptSchema.index({ receiptNumber: 1 });

// Virtual for formatted total
receiptSchema.virtual('formattedTotal').get(function() {
  return `$${this.total.toFixed(2)}`;
});

// Method to generate receipt summary
receiptSchema.methods.getSummary = function() {
  return {
    receiptNumber: this.receiptNumber,
    name: this.name,
    email: this.email,
    total: this.total,
    itemCount: this.items.length,
    timestamp: this.createdAt
  };
};

// Enable virtuals in JSON
receiptSchema.set('toJSON', { virtuals: true });
receiptSchema.set('toObject', { virtuals: true });

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
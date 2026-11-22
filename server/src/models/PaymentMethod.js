const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['cod', 'mobile_banking', 'bank_transfer', 'other'],
      default: 'cod'
    },
    instructions: {
      type: String,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    accountType: {
      type: String,
      default: 'Personal' // Personal, Merchant, Agent
    },
    isActive: {
      type: Boolean,
      default: true
    },
    requiresTransactionId: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);

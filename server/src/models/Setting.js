const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedDays: {
    type: String,
    default: '2-3 Days'
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const settingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Abu Ahmed Collection'
    },
    storePhone: {
      type: String,
      default: '+8801700000000'
    },
    storeEmail: {
      type: String,
      default: 'support@abuahmedcollection.com'
    },
    storeAddress: {
      type: String,
      default: 'Dhaka, Bangladesh'
    },
    whatsappNumber: {
      type: String,
      default: '8801700000000'
    },
    currencySymbol: {
      type: String,
      default: '৳'
    },
    freeShippingThreshold: {
      type: Number,
      default: 5000 // Free delivery if order >= 5000 BDT
    },
    deliveryZones: {
      type: [deliveryZoneSchema],
      default: [
        {
          key: 'inside_dhaka',
          name: 'Inside Dhaka',
          fee: 80,
          estimatedDays: '1-2 Days',
          isActive: true
        },
        {
          key: 'outside_dhaka',
          name: 'Outside Dhaka',
          fee: 150,
          estimatedDays: '3-5 Days',
          isActive: true
        }
      ]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);

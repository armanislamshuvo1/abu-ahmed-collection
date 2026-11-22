const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  }
});

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Customer email is required for tracking'],
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true
      },
      address: {
        type: String,
        required: [true, 'Delivery address is required'],
        trim: true
      },
      deliveryZoneKey: {
        type: String,
        required: true,
        default: 'inside_dhaka'
      },
      deliveryZoneName: {
        type: String,
        default: 'Inside Dhaka'
      },
      notes: {
        type: String,
        default: ''
      }
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    paymentMethod: {
      code: {
        type: String,
        default: 'cod'
      },
      name: {
        type: String,
        default: 'Cash on Delivery'
      },
      transactionId: {
        type: String,
        default: ''
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

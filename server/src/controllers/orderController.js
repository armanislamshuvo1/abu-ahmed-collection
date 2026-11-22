const Order = require('../models/Order');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const { generateOrderId, generateWhatsAppLink, sendOrderEmail } = require('../services/notificationService');

// @desc    Place a new order (Guest or Logged in)
// @route   POST /api/orders
// @access  Public (Optional User)
const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({
        message: 'Customer name, valid email, phone number, and delivery address are all required.'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one saree item.' });
    }

    // Fetch store settings for delivery fee calculation
    let settings = await Setting.findOne();
    
    // Server-side anti-tamper verification of delivery zone from address & district
    const fullAddr = (customer.address || '').toLowerCase();
    const customerDistrict = (customer.district || '').toLowerCase();

    // Check if customer matches an active district override
    const districtOverride = settings?.districtOverrides?.find(
      d => d.isActive && (
        (customerDistrict && d.district.toLowerCase() === customerDistrict) ||
        fullAddr.includes(d.district.toLowerCase())
      )
    );

    let zoneKey = customer.deliveryZoneKey || 'inside_dhaka';
    let deliveryFee = 0;
    let zoneName = '';

    if (districtOverride) {
      zoneKey = 'district_' + districtOverride.district.toLowerCase().replace(/\s+/g, '_');
      zoneName = districtOverride.district + ' District';
      deliveryFee = districtOverride.fee;
    } else {
      const isDhakaSuburbs = ['savar', 'ashulia', 'dhamrai', 'keraniganj', 'dohar', 'nawabganj', 'gazipur', 'narayanganj'].some(sub => fullAddr.includes(sub));
      if (!fullAddr.includes('dhaka') || isDhakaSuburbs) {
        zoneKey = 'outside_dhaka';
      } else {
        zoneKey = 'inside_dhaka';
      }
      const zone = settings?.deliveryZones?.find(z => z.key === zoneKey && z.isActive);
      deliveryFee = zone ? zone.fee : (zoneKey === 'outside_dhaka' ? 150 : 80);
      zoneName = zone ? zone.name : (zoneKey === 'outside_dhaka' ? 'Outside Dhaka' : 'Inside Dhaka');
    }

    // Calculate subtotal and build verified items
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      }

      const activePrice = (product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > 0)
        ? product.discountPrice
        : product.regularPrice;

      const qty = Math.max(1, Number(item.quantity) || 1);
      subtotal += activePrice * qty;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: activePrice,
        quantity: qty,
        image: item.image || (product.images && product.images[0]) || '/logo.jpg'
      });
    }

    // Free delivery threshold check
    if (settings && settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
      deliveryFee = 0;
    }

    const total = subtotal + deliveryFee;
    const orderId = await generateOrderId(Order);

    const isCod = (!paymentMethod?.code || paymentMethod.code === 'cod');
    const hasTrx = Boolean(paymentMethod?.transactionId && paymentMethod.transactionId.trim());
    const initialStatus = isCod
      ? 'Pending'
      : (hasTrx ? 'Verifying Payment' : 'Pending Payment');

    const initialTimeline = [
      {
        status: initialStatus,
        timestamp: new Date(),
        note: initialStatus === 'Pending Payment'
          ? `Order placed. Awaiting ${paymentMethod?.name || 'payment'} Transaction ID (TrxID)`
          : (initialStatus === 'Verifying Payment'
              ? `Order placed with ${paymentMethod?.name} TrxID: ${paymentMethod?.transactionId}. Payment verifying.`
              : 'Order placed by customer via website')
      }
    ];

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        name: customer.name.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        deliveryZoneKey: zoneKey,
        deliveryZoneName: zoneName,
        notes: customer.notes || ''
      },
      items: verifiedItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: {
        code: paymentMethod?.code || 'cod',
        name: paymentMethod?.name || 'Cash on Delivery',
        transactionId: paymentMethod?.transactionId || ''
      },
      status: initialStatus,
      timeline: initialTimeline
    });

    // Generate WhatsApp links
    const ownerWhatsAppNumber = settings?.whatsappNumber || process.env.WHATSAPP_NUMBER || '8801700000000';
    const ownerWhatsAppUrl = generateWhatsAppLink(order, ownerWhatsAppNumber);
    const customerWhatsAppUrl = generateWhatsAppLink(order, order.customer.phone);

    // Asynchronously attempt email notifications
    if (order.customer.email) {
      sendOrderEmail(order, order.customer.email, false).catch(() => {});
    }
    const adminEmail = settings?.storeEmail || process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendOrderEmail(order, adminEmail, true).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      order,
      ownerWhatsAppUrl,
      customerWhatsAppUrl
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Track order by unique order ID (Public)
// @route   GET /api/orders/track/:orderId
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const rawId = req.params.orderId.trim().toUpperCase();
    const order = await Order.findOne({ orderId: rawId });

    if (!order) {
      return res.status(404).json({ message: `No order found with ID: ${rawId}. Please check and try again.` });
    }

    const settings = await Setting.findOne();
    const ownerWhatsAppNumber = settings?.whatsappNumber || '8801700000000';
    const whatsAppUrl = generateWhatsAppLink(order, ownerWhatsAppNumber);

    return res.json({
      orderId: order.orderId,
      customer: {
        name: order.customer.name,
        phone: order.customer.phone.replace(/.(?=.{4})/g, '*'), // partial mask for privacy
        address: order.customer.address,
        deliveryZoneName: order.customer.deliveryZoneName
      },
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      timeline: order.timeline,
      createdAt: order.createdAt,
      whatsAppUrl
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getOrdersAdmin = async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (status && status !== 'All' && status !== 'undefined') {
      filter.status = status;
    }

    if (search && search !== 'undefined' && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { orderId: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'customer.email': searchRegex }
      ];
    }

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order details (Admin)
// @route   GET /api/orders/:id
// @access  Private (Admin)
const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const settings = await Setting.findOne();
    const ownerWhatsAppNumber = settings?.whatsappNumber || '8801700000000';
    const ownerWhatsAppUrl = generateWhatsAppLink(order, ownerWhatsAppNumber);
    const customerWhatsAppUrl = generateWhatsAppLink(order, order.customer.phone);

    return res.json({
      order,
      ownerWhatsAppUrl,
      customerWhatsAppUrl
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending Payment', 'Verifying Payment', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status changed to ${status} by admin`
    });

    const updated = await order.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Get Dashboard statistics (Admin)
// @route   GET /api/orders/stats/overview
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Revenue calculation from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Products low in stock
    const lowStockCount = await Product.countDocuments({ inStock: false });
    const totalProducts = await Product.countDocuments();

    return res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      lowStockCount,
      recentOrders
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// @desc    Customer submits transaction ID for an order
// @route   PATCH /api/orders/track/:orderId/transaction-id
// @access  Public
const submitOrderTransactionId = async (req, res) => {
  try {
    const rawId = req.params.orderId.trim().toUpperCase();
    const { transactionId } = req.body;

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({ message: 'Transaction ID is required.' });
    }

    const order = await Order.findOne({ orderId: rawId });
    if (!order) {
      return res.status(404).json({ message: `No order found with ID: ${rawId}` });
    }

    order.paymentMethod.transactionId = transactionId.trim();
    order.status = 'Verifying Payment';

    order.timeline.push({
      status: 'Verifying Payment',
      timestamp: new Date(),
      note: `Customer submitted ${order.paymentMethod.name} Transaction ID: ${transactionId.trim()}. Awaiting verification.`
    });

    await order.save();

    return res.json({
      success: true,
      message: 'Transaction ID recorded successfully!',
      order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  trackOrder,
  submitOrderTransactionId,
  getOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  getAdminStats
};

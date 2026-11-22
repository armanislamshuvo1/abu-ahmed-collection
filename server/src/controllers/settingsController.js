const Setting = require('../models/Setting');
const PaymentMethod = require('../models/PaymentMethod');

// Helper to get or create default settings
const getOrCreateDefaultSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({
      storeName: 'Abu Ahmed Collection',
      storePhone: '+880 1806-732097',
      storeEmail: 'mabuahmedsons786@gmail.com',
      storeAddress: 'Shop No. 106, RS Road, Reazuddin Bazar, Chittagong, Bangladesh',
      whatsappNumber: '8801806732097',
      facebookUrl: 'https://www.facebook.com/people/Abu-Ahmed-Collection/61586448518021/',
      currencySymbol: '৳',
      freeShippingThreshold: 5000,
      deliveryZones: [
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
    });
  }
  return settings;
};

// @desc    Get public storefront settings & active payment methods
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = async (req, res) => {
  try {
    const settings = await getOrCreateDefaultSettings();
    const paymentMethods = await PaymentMethod.find({ isActive: true }).sort({ sortOrder: 1 });

    return res.json({
      storeName: settings.storeName,
      storePhone: settings.storePhone,
      storeEmail: settings.storeEmail,
      storeAddress: settings.storeAddress,
      whatsappNumber: settings.whatsappNumber,
      facebookUrl: settings.facebookUrl || 'https://www.facebook.com/people/Abu-Ahmed-Collection/61586448518021/',
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold,
      deliveryZones: settings.deliveryZones.filter(z => z.isActive),
      paymentMethods
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get full settings (Admin)
// @route   GET /api/settings
// @access  Private (Admin)
const getAdminSettings = async (req, res) => {
  try {
    const settings = await getOrCreateDefaultSettings();
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery fees and free shipping threshold (Admin)
// @route   PUT /api/settings/delivery
// @access  Private (Admin)
const updateDeliverySettings = async (req, res) => {
  try {
    const { deliveryZones, freeShippingThreshold } = req.body;
    const settings = await getOrCreateDefaultSettings();

    if (deliveryZones && Array.isArray(deliveryZones)) {
      settings.deliveryZones = deliveryZones;
    }
    if (freeShippingThreshold !== undefined) {
      settings.freeShippingThreshold = Number(freeShippingThreshold);
    }

    const updated = await settings.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update general store contact settings (Admin)
// @route   PUT /api/settings/general
// @access  Private (Admin)
const updateGeneralSettings = async (req, res) => {
  try {
    const { storeName, storePhone, storeEmail, storeAddress, whatsappNumber, facebookUrl } = req.body;
    const settings = await getOrCreateDefaultSettings();

    if (storeName) settings.storeName = storeName;
    if (storePhone) settings.storePhone = storePhone;
    if (storeEmail) settings.storeEmail = storeEmail;
    if (storeAddress) settings.storeAddress = storeAddress;
    if (whatsappNumber) settings.whatsappNumber = whatsappNumber;
    if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;

    const updated = await settings.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ---------------- Payment Methods (Admin) ----------------

// @desc    Get all payment methods (Admin)
// @route   GET /api/settings/payment-methods
// @access  Private (Admin)
const getPaymentMethodsAdmin = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ sortOrder: 1, createdAt: -1 });
    return res.json(methods);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create new payment method (Admin)
// @route   POST /api/settings/payment-methods
// @access  Private (Admin)
const createPaymentMethod = async (req, res) => {
  try {
    const { name, code, type, instructions, accountNumber, accountType, isActive, requiresTransactionId, sortOrder } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and unique code are required' });
    }

    const cleanCode = code.toLowerCase().trim().replace(/\s+/g, '_');
    const existing = await PaymentMethod.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ message: `Payment method with code '${cleanCode}' already exists` });
    }

    const method = await PaymentMethod.create({
      name,
      code: cleanCode,
      type: type || 'mobile_banking',
      instructions: instructions || '',
      accountNumber: accountNumber || '',
      accountType: accountType || 'Personal',
      isActive: isActive !== undefined ? isActive : true,
      requiresTransactionId: requiresTransactionId !== undefined ? requiresTransactionId : (type === 'mobile_banking'),
      sortOrder: sortOrder ? Number(sortOrder) : 0
    });

    return res.status(201).json(method);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update payment method (Admin)
// @route   PUT /api/settings/payment-methods/:id
// @access  Private (Admin)
const updatePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    method.name = req.body.name || method.name;
    method.type = req.body.type || method.type;
    method.instructions = req.body.instructions !== undefined ? req.body.instructions : method.instructions;
    method.accountNumber = req.body.accountNumber !== undefined ? req.body.accountNumber : method.accountNumber;
    method.accountType = req.body.accountType || method.accountType;
    method.isActive = req.body.isActive !== undefined ? req.body.isActive : method.isActive;
    method.requiresTransactionId = req.body.requiresTransactionId !== undefined ? req.body.requiresTransactionId : method.requiresTransactionId;
    method.sortOrder = req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : method.sortOrder;

    const updated = await method.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Delete payment method (Admin)
// @route   DELETE /api/settings/payment-methods/:id
// @access  Private (Admin)
const deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    await PaymentMethod.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateDeliverySettings,
  updateGeneralSettings,
  getPaymentMethodsAdmin,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
};

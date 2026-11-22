require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const PaymentMethod = require('../models/PaymentMethod');
const Setting = require('../models/Setting');
const Order = require('../models/Order');
const { seedCategories, seedPaymentMethods, seedProducts } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/abu_ahmed_collection';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await PaymentMethod.deleteMany({});
    await Setting.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared old collections.');

    // 1. Create Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@abuahmedcollection.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
    const admin = await Admin.create({
      name: 'Abu Ahmed (Managing Director)',
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log(`[Seed] Admin created: ${admin.email} (Password: ${adminPassword})`);

    // 2. Create Demo Customer
    const customer = await User.create({
      name: 'Farhana Yasmin',
      email: 'customer@example.com',
      phone: '01712345678',
      password: 'customer123',
      address: 'House 24, Road 7, Sector 3, Uttara, Dhaka',
      city: 'Dhaka'
    });
    console.log(`[Seed] Demo Customer created: ${customer.email} (Password: customer123)`);

    // 3. Create Settings
    const settings = await Setting.create({
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
    console.log('[Seed] Settings & Delivery fees created.');

    // 4. Create Payment Methods
    await PaymentMethod.insertMany(seedPaymentMethods);
    console.log(`[Seed] Inserted ${seedPaymentMethods.length} payment methods.`);

    // 5. Create Categories
    await Category.insertMany(seedCategories);
    console.log(`[Seed] Inserted ${seedCategories.length} categories.`);

    // 6. Create Products
    const createdProducts = await Product.insertMany(seedProducts);
    console.log(`[Seed] Inserted ${createdProducts.length} authentic sarees.`);

    // 7. Create Sample Orders
    const sampleOrders = [
      {
        orderId: 'AAC-2026-1001',
        user: customer._id,
        customer: {
          name: 'Farhana Yasmin',
          email: 'customer@example.com',
          phone: '01712345678',
          address: 'House 24, Road 7, Sector 3, Uttara, Dhaka',
          deliveryZoneKey: 'inside_dhaka',
          deliveryZoneName: 'Inside Dhaka',
          notes: 'Please call before delivery'
        },
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].discountPrice || createdProducts[0].regularPrice,
            quantity: 1,
            image: createdProducts[0].images[0]
          }
        ],
        subtotal: 3850,
        deliveryFee: 80,
        total: 3930,
        paymentMethod: {
          code: 'cod',
          name: 'Cash on Delivery (COD)',
          transactionId: ''
        },
        status: 'Delivered',
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 4 * 86400000), note: 'Order placed by customer' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Verified by phone call' },
          { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Quality check and gift packed' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Dispatched via Steadfast Courier' },
          { status: 'Delivered', timestamp: new Date(), note: 'Successfully handed over to customer' }
        ]
      },
      {
        orderId: 'AAC-2026-1002',
        user: null, // Guest order
        customer: {
          name: 'Nusrat Jahan',
          email: 'nusrat.jahan@gmail.com',
          phone: '01819998877',
          address: 'Alankar Shopping Complex, Pahartali, Chittagong',
          deliveryZoneKey: 'outside_dhaka',
          deliveryZoneName: 'Outside Dhaka',
          notes: 'Deliver carefully with gift box'
        },
        items: [
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            price: createdProducts[1].discountPrice || createdProducts[1].regularPrice,
            quantity: 1,
            image: createdProducts[1].images[0]
          }
        ],
        subtotal: 2849,
        deliveryFee: 150,
        total: 2999,
        paymentMethod: {
          code: 'bkash',
          name: 'bKash',
          transactionId: '9G7K21LM88'
        },
        status: 'Processing',
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 1 * 86400000), note: 'Order placed via website (Guest)' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 12 * 3600000), note: 'bKash TrxID 9G7K21LM88 verified' },
          { status: 'Processing', timestamp: new Date(Date.now() - 3 * 3600000), note: 'Packaging in progress' }
        ]
      },
      {
        orderId: 'AAC-2026-1003',
        user: null,
        customer: {
          name: 'Tanvir Ahmed',
          email: 'tanvir.ahmed@yahoo.com',
          phone: '01911223344',
          address: 'Plot 15, Block B, Bashundhara R/A, Dhaka',
          deliveryZoneKey: 'inside_dhaka',
          deliveryZoneName: 'Inside Dhaka',
          notes: 'Urgent delivery if possible'
        },
        items: [
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            price: createdProducts[2].discountPrice || createdProducts[2].regularPrice,
            quantity: 1,
            image: createdProducts[2].images[0]
          }
        ],
        subtotal: 7200,
        deliveryFee: 0, // Free delivery because >= 5000 BDT
        total: 7200,
        paymentMethod: {
          code: 'cod',
          name: 'Cash on Delivery (COD)',
          transactionId: ''
        },
        status: 'Pending',
        timeline: [
          { status: 'Pending', timestamp: new Date(), note: 'Order placed by customer via 1-Click Buy Now' }
        ]
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`[Seed] Inserted ${sampleOrders.length} sample orders.`);

    console.log('✅ [Seed] Database successfully seeded with royal saree catalog & accounts!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();

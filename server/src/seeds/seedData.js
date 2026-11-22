const seedCategories = [
  {
    name: 'Dhakai Jamdani',
    slug: 'dhakai-jamdani',
    description: 'Heritage handwoven Jamdani sarees featuring exquisite motifs and artisanal zari craftsmanship.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    sortOrder: 1,
    isActive: true
  },
  {
    name: 'Handloom Silk',
    slug: 'handloom-silk',
    description: 'Ultra-luxurious silk sarees with silky smooth fall, festive sheen, and opulent pallus.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    sortOrder: 2,
    isActive: true
  },
  {
    name: 'Banarasi Katan',
    slug: 'banarasi-katan',
    description: 'Grand royal wedding and bridal katan sarees adorned with rich all-over zari brocade.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    sortOrder: 3,
    isActive: true
  },
  {
    name: 'Tangail Cotton',
    slug: 'tangail-cotton',
    description: 'Breathable, graceful pure handspun Tangail soti cotton sarees ideal for both daily poise and elegant gatherings.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    sortOrder: 4,
    isActive: true
  },
  {
    name: 'Royal Muslin',
    slug: 'royal-muslin',
    description: 'Feather-light heritage muslin woven with centuries-old Dhakai artistry.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    sortOrder: 5,
    isActive: true
  }
];

const seedPaymentMethods = [
  {
    name: 'Cash on Delivery (COD)',
    code: 'cod',
    type: 'cod',
    instructions: 'Pay with cash upon delivery at your doorstep across all 64 districts in Bangladesh.',
    accountNumber: '',
    isActive: true,
    requiresTransactionId: false,
    sortOrder: 1
  },
  {
    name: 'bKash',
    code: 'bkash',
    type: 'mobile_banking',
    instructions: 'Please Send Money to our official bKash Personal Number: 01799-887766. After payment, enter your bKash Transaction ID (TrxID) below for swift confirmation.',
    accountNumber: '01799887766',
    accountType: 'Personal',
    isActive: true,
    requiresTransactionId: true,
    sortOrder: 2
  },
  {
    name: 'Nagad',
    code: 'nagad',
    type: 'mobile_banking',
    instructions: 'Please Send Money or Pay to our Nagad Number: 01899-887766. Enter your Nagad Transaction ID below.',
    accountNumber: '01899887766',
    accountType: 'Merchant',
    isActive: true,
    requiresTransactionId: true,
    sortOrder: 3
  },
  {
    name: 'Bank Transfer',
    code: 'bank_transfer',
    type: 'bank_transfer',
    instructions: 'Bank: City Bank Bangladesh | Account: Abu Ahmed Collection | A/C No: 1203498821001 | Branch: Dhanmondi, Dhaka.',
    accountNumber: '1203498821001',
    accountType: 'Current',
    isActive: true,
    requiresTransactionId: true,
    sortOrder: 4
  }
];

const seedProducts = [
  {
    name: 'Royal Black & Gold Heritage Dhakai Jamdani Saree',
    slug: 'royal-black-gold-heritage-dhakai-jamdani',
    category: 'Dhakai Jamdani',
    regularPrice: 4500,
    discountPrice: 3850,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      '/logo.jpg'
    ],
    description: 'An iconic masterwork of Bangladeshi heritage. Handcrafted on traditional pit-looms by master artisans over 3 weeks, this saree showcases geometric floral motifs interwoven with shimmering antique gold metallic zari against a jet-black body. Finished with a regal temple border and tassel-finished anchol.',
    fabric: 'Dhakai Jamdani Cotton & Zari',
    blousePiece: true,
    colors: ['Jet Black', 'Antique Gold'],
    stock: 12,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    careInstructions: 'Dry clean only. Preserve in soft muslin cloth.'
  },
  {
    name: 'Lavender and Teal Floral Handloom Silk Saree with Tassels',
    slug: 'lavender-teal-floral-handloom-silk',
    category: 'Handloom Silk',
    regularPrice: 3200,
    discountPrice: 2849,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A contemporary festival favorite inspired by soft evening twilight. Featuring multi-color zig-zag woven zari borders, delicate floral butis across the soft handloom silk body, and artisan hand-tied matching tassels on the anchol.',
    fabric: 'Handloom Silk',
    blousePiece: true,
    colors: ['Teal & Lavender', 'Bottle Green', 'Gold'],
    stock: 18,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    careInstructions: 'Gentle dry wash. Avoid direct sunlight drying.'
  },
  {
    name: 'Crimson Red Banarasi Katan Silk Bridal Saree',
    slug: 'crimson-red-banarasi-katan-bridal',
    category: 'Banarasi Katan',
    regularPrice: 8500,
    discountPrice: 7200,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'The epitome of Bengali bridal majesty. Woven with pure mulberry katan silk yarn and encrusted with heavy gold zari jaal weaving, paisley corner motifs, and an opulent royal anchol. Unmatched weight and regal presence for weddings and grand receptions.',
    fabric: 'Pure Katan Silk',
    blousePiece: true,
    colors: ['Crimson Red', 'Royal Gold'],
    stock: 8,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    careInstructions: 'Strictly dry clean. Roll inside-out in saree bag.'
  },
  {
    name: 'Tangail Handloom Pure Soti Cotton Saree - Mustard & Violet',
    slug: 'tangail-handloom-pure-soti-cotton',
    category: 'Tangail Cotton',
    regularPrice: 2499,
    discountPrice: 2199,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Woven in the historical weaver colonies of Tangail, this 100% combed cotton saree offers sublime day-long comfort in warm climates with an alluring contrast violet-and-mustard zari border. Crisp yet soft drape.',
    fabric: 'Pure Tangail Cotton',
    blousePiece: false,
    colors: ['Mustard', 'Violet', 'Pink'],
    stock: 25,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    careInstructions: 'Cold hand wash with mild liquid detergent.'
  },
  {
    name: 'Firoja Turquoise & Antique Gold Zari Silk Saree',
    slug: 'firoja-turquoise-golden-zari-silk',
    category: 'Handloom Silk',
    regularPrice: 3200,
    discountPrice: 2850,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Striking turquoise firoja hues crowned by ornate antique golden zari borders. This saree balances modern aesthetics with traditional Bengali elegance, making it a standout choice for eid, puja, and festive evenings.',
    fabric: 'Soft Handloom Silk',
    blousePiece: true,
    colors: ['Turquoise', 'Antique Gold'],
    stock: 14,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    careInstructions: 'Dry clean recommended.'
  },
  {
    name: 'Feather-Light Royal Gold Woven Muslin Saree',
    slug: 'feather-light-royal-gold-muslin',
    category: 'Royal Muslin',
    regularPrice: 6200,
    discountPrice: 5400,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'An ethereal creation woven from ultra-fine 300+ count yarn with subtle golden thread motifs scattered across an ivory canvas. Light as a breeze with supreme regal grace.',
    fabric: 'Dhakai Muslin',
    blousePiece: true,
    colors: ['Ivory Cream', 'Champagne Gold'],
    stock: 6,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    careInstructions: 'Dry clean only.'
  },
  {
    name: 'Emerald Green Katan Silk Saree with Contrast Zari Pallu',
    slug: 'emerald-green-katan-silk-pallu',
    category: 'Banarasi Katan',
    regularPrice: 5800,
    discountPrice: 4950,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'Deep forest emerald green silk woven with elaborate floral motifs and an enchanting maroon contrast zari pallu. Pairs effortlessly with traditional gold jewelry.',
    fabric: 'Katan Silk',
    blousePiece: true,
    colors: ['Emerald Green', 'Maroon', 'Gold'],
    stock: 10,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    careInstructions: 'Dry clean only.'
  },
  {
    name: 'Midnight Black & Rose Gold Handloom Cotton Jamdani',
    slug: 'midnight-black-rose-gold-cotton-jamdani',
    category: 'Dhakai Jamdani',
    regularPrice: 3800,
    discountPrice: 3250,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85'
    ],
    description: 'A contemporary take on traditional Jamdani incorporating warm rose-gold zari threads against a rich dark background. Featherweight yet sophisticated.',
    fabric: 'Jamdani Cotton',
    blousePiece: true,
    colors: ['Black', 'Rose Gold'],
    stock: 15,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    careInstructions: 'Dry wash recommended.'
  }
];

module.exports = {
  seedCategories,
  seedPaymentMethods,
  seedProducts
};

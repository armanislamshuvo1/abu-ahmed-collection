const Product = require('../models/Product');

// Helper to slugify product title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Fetch all products with filtering & sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, fabric, featured, newArrival, inStock, search, sort } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (fabric && fabric !== 'All') {
      filter.fabric = { $regex: new RegExp(`^${fabric}$`, 'i') };
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (newArrival === 'true') {
      filter.isNewArrival = true;
    }

    if (inStock === 'true') {
      filter.inStock = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Product.find(filter);

    // Sorting
    if (sort === 'price_asc') {
      query = query.sort({ discountPrice: 1, regularPrice: 1 });
    } else if (sort === 'price_desc') {
      query = query.sort({ discountPrice: -1, regularPrice: -1 });
    } else if (sort === 'name_asc') {
      query = query.sort({ name: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by slug or id
// @route   GET /api/products/:slugOrId
// @access  Public
const getProductBySlugOrId = async (req, res) => {
  try {
    const param = req.params.slugOrId;
    let product;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param);
    }
    if (!product) {
      product = await Product.findOne({ slug: param });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Also fetch related products from same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .select('name slug regularPrice discountPrice images fabric inStock');

    return res.json({ product, related });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      regularPrice,
      discountPrice,
      description,
      fabric,
      blousePiece,
      colors,
      stock,
      inStock,
      isFeatured,
      isNewArrival,
      careInstructions,
      existingImages
    } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    if (existingImages) {
      const parsed = Array.isArray(existingImages) ? existingImages : [existingImages];
      images = [...images, ...parsed];
    }

    if (images.length === 0) {
      images = ['/logo.jpg'];
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await Product.create({
      name,
      slug,
      category,
      regularPrice: Number(regularPrice),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      images,
      description,
      fabric,
      blousePiece: blousePiece === 'true' || blousePiece === true,
      colors: typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors || [],
      stock: stock ? Number(stock) : 10,
      inStock: inStock === 'true' || inStock === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      careInstructions: careInstructions || undefined
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      category,
      regularPrice,
      discountPrice,
      description,
      fabric,
      blousePiece,
      colors,
      stock,
      inStock,
      isFeatured,
      isNewArrival,
      careInstructions,
      keptImages
    } = req.body;

    let images = [];
    if (keptImages) {
      images = Array.isArray(keptImages) ? keptImages : [keptImages];
    } else {
      images = [...product.images];
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    if (images.length === 0) {
      images = product.images;
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.regularPrice = regularPrice !== undefined ? Number(regularPrice) : product.regularPrice;
    product.discountPrice = discountPrice !== undefined && discountPrice !== '' ? Number(discountPrice) : null;
    product.description = description || product.description;
    product.fabric = fabric || product.fabric;
    product.blousePiece = blousePiece !== undefined ? blousePiece === 'true' || blousePiece === true : product.blousePiece;
    product.colors = colors ? (typeof colors === 'string' ? colors.split(',').map(c => c.trim()) : colors) : product.colors;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.inStock = inStock !== undefined ? inStock === 'true' || inStock === true : product.inStock;
    product.isFeatured = isFeatured !== undefined ? isFeatured === 'true' || isFeatured === true : product.isFeatured;
    product.isNewArrival = isNewArrival !== undefined ? isNewArrival === 'true' || isNewArrival === true : product.isNewArrival;
    product.careInstructions = careInstructions || product.careInstructions;
    product.images = images;

    const updated = await product.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle stock status
// @route   PATCH /api/products/:id/toggle-stock
// @access  Private (Admin)
const toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.inStock = !product.inStock;
    await product.save();
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStock
};

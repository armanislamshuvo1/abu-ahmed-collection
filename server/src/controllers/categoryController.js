const Category = require('../models/Category');

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: -1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image, sortOrder } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    let slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      sortOrder: sortOrder ? Number(sortOrder) : 0
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.image = req.body.image !== undefined ? req.body.image : category.image;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
    category.sortOrder = req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : category.sortOrder;

    const updated = await category.save();
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await Category.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
};

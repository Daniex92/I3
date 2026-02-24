import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, search, sort } = req.query;

    const filters = {
      category_id: category ? parseInt(category) : null,
      subcategory_id: subcategory ? parseInt(subcategory) : null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      search: search || null,
      sort: sort || 'newest',
    };

    const products = await Product.findAll(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, subcategory_id, image_url } = req.body;

    if (!name || !description || !price || !subcategory_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await Product.create(
      subcategory_id,
      name,
      description,
      parseFloat(price),
      parseInt(stock) || 0,
      image_url || null
    );

    res.status(201).json({
      message: 'Product created',
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await Product.update(id, data);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.delete(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      const allSubcategories = await Category.getAllSubcategories();
      return res.json(allSubcategories);
    }

    const subcategories = await Category.getSubcategories(categoryId);
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

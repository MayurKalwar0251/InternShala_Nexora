/**
 * Product Controller
 * Handles product-related business logic
 * Fetches products from Fake Store API
 */

const axios = require('axios');

/**
 * @desc    Get all products from Fake Store API
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, sort = 'asc' } = req.query;
    
    // Fetch products from Fake Store API
    const response = await axios.get(
      `https://fakestoreapi.com/products?limit=${limit}&sort=${sort}`
    );

    // Validate response
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    res.status(200).json({
      success: true,
      count: response.data.length,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching products:', error.message);
    
    // Handle API errors gracefully
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'Failed to fetch products from external API',
        error: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

/**
 * @desc    Get single product by ID from Fake Store API
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Fetch single product
    const response = await axios.get(
      `https://fakestoreapi.com/products/${id}`
    );

    if (!response.data) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching product:', error.message);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const response = await axios.get(
      `https://fakestoreapi.com/products/category/${category}`
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found in category: ${category}`
      });
    }

    res.status(200).json({
      success: true,
      category,
      count: response.data.length,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category'
    });
  }
};

/**
 * @desc    Get all available categories
 * @route   GET /api/products/categories/all
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const response = await axios.get(
      'https://fakestoreapi.com/products/categories'
    );

    res.status(200).json({
      success: true,
      count: response.data.length,
      data: response.data
    });

  } catch (error) {
    console.error('Error fetching categories:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategories
};
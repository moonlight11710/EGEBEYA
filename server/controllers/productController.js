const dataAccess = require('../data/dataAccess');

exports.getProducts = async (req, res) => {
  try {
    const { category, availability, search, sort } = req.query;
    const products = await dataAccess.getProducts({
      category,
      availability,
      search,
      sort,
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await dataAccess.getProductBySlugOrId(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with slug or ID "${slug}"`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details',
      error: error.message,
    });
  }
};


const dataAccess = require('../data/dataAccess');

exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      productTitle,
      productCategory,
      unitPriceSnapshot,
      customerName,
      customerPhone,
      customerTelegramOrWhatsapp,
      deliveryAddressOrCity,
      quantity,
      selectedSpecsOrNotes,
    } = req.body;

    // Basic validation
    if (!customerName || !customerPhone || !deliveryAddressOrCity) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, and delivery address are required.',
      });
    }

    const orderQty = parseInt(quantity, 10) || 1;
    if (orderQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.',
      });
    }

    // Check product details and MOQ if productId is supplied
    let product = null;
    if (productId) {
      product = await dataAccess.getProductBySlugOrId(productId);
    }

    const resolvedTitle = productTitle || (product ? product.title : 'Custom Imported Item');
    const resolvedCategory = productCategory || (product ? product.category : 'electronics');
    const resolvedPrice =
      unitPriceSnapshot !== undefined
        ? unitPriceSnapshot
        : product && product.price
        ? product.price
        : null;

    // Enforce MOQ for raw materials
    if (product && product.category === 'raw_materials') {
      const moq =
        product.materialSpecs && product.materialSpecs.minimumOrderQuantity
          ? Number(product.materialSpecs.minimumOrderQuantity)
          : 1;
      const unitType =
        (product.materialSpecs && product.materialSpecs.unitType) || 'units';

      if (orderQty < moq) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for this item is ${moq} ${unitType}. You requested ${orderQty}.`,
        });
      }
    }

    const newOrder = await dataAccess.createOrder({
      productId: product ? product._id || product.id : productId,
      productTitle: resolvedTitle,
      productCategory: resolvedCategory,
      unitPriceSnapshot: resolvedPrice,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerTelegramOrWhatsapp: customerTelegramOrWhatsapp
        ? customerTelegramOrWhatsapp.trim()
        : '',
      deliveryAddressOrCity: deliveryAddressOrCity.trim(),
      quantity: orderQty,
      selectedSpecsOrNotes: selectedSpecsOrNotes || '',
      status: 'pending_confirmation',
    });

    res.status(201).json({
      success: true,
      message: 'Pre-order placed successfully!',
      data: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place pre-order',
      error: error.message,
    });
  }
};

exports.getOrderByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const order = await dataAccess.getOrderByCode(code);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${code} was not found.`,
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order by code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to look up order',
      error: error.message,
    });
  }
};


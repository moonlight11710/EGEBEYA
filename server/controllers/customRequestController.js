const dataAccess = require('../data/dataAccess');

exports.createCustomRequest = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      category,
      itemNameOrModel,
      desiredSpecsAndQuantity,
      targetBudget,
      referenceLinkOrImage,
    } = req.body;

    if (!customerName || !customerPhone || !itemNameOrModel || !desiredSpecsAndQuantity) {
      return res.status(400).json({
        success: false,
        message:
          'Name, phone number, item name/model, and desired specs & quantity are required.',
      });
    }

    const newRequest = await dataAccess.createCustomRequest({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      category: category || 'electronics',
      itemNameOrModel: itemNameOrModel.trim(),
      desiredSpecsAndQuantity: desiredSpecsAndQuantity.trim(),
      targetBudget: targetBudget ? targetBudget.trim() : '',
      referenceLinkOrImage: referenceLinkOrImage ? referenceLinkOrImage.trim() : '',
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Custom import request submitted successfully!',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error creating custom request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit custom import request',
      error: error.message,
    });
  }
};


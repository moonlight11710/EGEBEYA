const dataAccess = require('../data/dataAccess');

exports.getSettings = async (req, res) => {
  try {
    const settings = await dataAccess.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store settings',
      error: error.message,
    });
  }
};


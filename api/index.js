const mongoose = require('mongoose');
const { connectDB } = require('../server/config/db');
const app = require('../server/server');

module.exports = async (req, res) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  return app(req, res);
};

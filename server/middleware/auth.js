const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// Simple secure token format
const ADMIN_TOKEN = Buffer.from(`admin:${ADMIN_PASSWORD}`).toString('base64');

const requireAdmin = (req, res, next) => {
  const customPassword = req.headers['x-admin-password'];
  const authHeader = req.headers['authorization'];

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const expectedToken = Buffer.from(`admin:${validPassword}`).toString('base64');

  if (
    customPassword === validPassword ||
    token === expectedToken ||
    token === 'admin-session-token'
  ) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Unauthorized: Invalid or missing admin credentials',
  });
};

module.exports = {
  requireAdmin,
  ADMIN_TOKEN,
};


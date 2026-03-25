const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];
  
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Get token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;
  
  const tokenFromCookie = req.cookies?.token || null;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    // For API routes, return error
    if (req.path.startsWith('/api') || req.method === 'POST') {
      return res.status(401).json({
        message: 'Authentication required',
        status: 'failure',
        status_code: 401,
        data: null
      });
    }
    // For page routes, redirect to login
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    // For API routes, return error
    if (req.path.startsWith('/api') || req.method === 'POST') {
      return res.status(401).json({
        message: 'Invalid or expired token',
        status: 'failure',
        status_code: 401,
        data: null
      });
    }
    // For page routes, redirect to login
    return res.redirect('/login');
  }
};

// Middleware to check if user is already logged in (for login/register pages)
const redirectIfLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : null;
  
  const tokenFromCookie = req.cookies?.token || null;
  const token = tokenFromHeader || tokenFromCookie;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      // If token is valid, redirect to home
      return res.redirect('/');
    } catch (err) {
      // Token is invalid, continue to login/register page
    }
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfLoggedIn
};
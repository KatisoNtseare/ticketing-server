import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('[protect] No token in cookies');
    return res.status(401).json({ message: 'Not authorized. No token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log('[protect] Authenticated user:', req.user.email);
    next();
  } catch (error) {
    console.error('[protect] Token verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized. Token invalid.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

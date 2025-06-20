import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT and add user info to request
export const protect = async (req, res, next) => {
    let token;

  // Check for Authorization header
    if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    ) {
    try {
      // Extract token from header
        token = req.headers.authorization.split(' ')[1];

      // Verify token and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request (excluding password)
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
    }

    if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to allow only admin users
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
    next();
    } else {
    res.status(403).json({ message: 'Admin access required' });
    }
};

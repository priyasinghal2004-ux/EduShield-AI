const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { error } = require('../utils/apiResponse');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || !req.user.isActive) {
        return error(res, 'Not authorized, user not found or inactive', 401);
      }
      next();
    } catch (err) {
      return error(res, 'Not authorized, token failed', 401);
    }
  } else {
    return error(res, 'Not authorized, no token', 401);
  }
};

module.exports = { protect };

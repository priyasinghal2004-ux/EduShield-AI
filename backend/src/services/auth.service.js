const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  }

  async verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}

module.exports = new AuthService();

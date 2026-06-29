const authService = require('../services/auth.service');
const { success } = require('../utils/apiResponse');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      success(res, data, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      success(res, req.user, 'User profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();

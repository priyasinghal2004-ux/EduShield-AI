const { error } = require('../utils/apiResponse');

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 'Not authorized to access this route', 403);
    }
    next();
  };
};

module.exports = { allowRoles };

const { error } = require('../utils/apiResponse');

const validate = (schema) => {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.body, { abortEarly: false });
    if (validationError) {
      const errors = validationError.details.map((detail) => detail.message);
      return error(res, 'Validation Error', 400, errors);
    }
    next();
  };
};

module.exports = validate;

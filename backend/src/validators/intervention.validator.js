const Joi = require('joi');

const createInterventionSchema = Joi.object({
  studentId: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('planned', 'in_progress', 'completed').default('planned')
});

const updateInterventionSchema = Joi.object({
  status: Joi.string().valid('planned', 'in_progress', 'completed').optional(),
  description: Joi.string().optional()
});

module.exports = { createInterventionSchema, updateInterventionSchema };

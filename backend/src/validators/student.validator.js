const Joi = require('joi');

const createStudentSchema = Joi.object({
  studentId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  grade: Joi.number().min(1).max(12).required(),
  assignedClass: Joi.string().optional(),
  demographics: Joi.object({
    age: Joi.number().optional(),
    gender: Joi.string().optional()
  }).optional(),
  attendance: Joi.object({
    totalDays: Joi.number().default(0),
    present: Joi.number().default(0),
    absent: Joi.number().default(0),
    tardy: Joi.number().default(0),
    consecutiveAbsences: Joi.number().default(0)
  }).optional(),
  academics: Joi.object({
    gpa: Joi.number().min(0).max(4.0).default(0),
    failedCourses: Joi.number().default(0),
    currentGrades: Joi.array().items(
      Joi.object({ course: Joi.string(), grade: Joi.string() })
    ).optional()
  }).optional(),
  behavior: Joi.object({
    disciplinaryIncidents: Joi.number().default(0),
    referrals: Joi.number().default(0),
    suspensions: Joi.number().default(0)
  }).optional()
});

const updateStudentSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  grade: Joi.number().min(1).max(12).optional(),
  assignedClass: Joi.string().optional(),
  enrollmentStatus: Joi.string().valid('enrolled', 'withdrawn', 'graduated').optional()
}).unknown(true);

module.exports = { createStudentSchema, updateStudentSchema };

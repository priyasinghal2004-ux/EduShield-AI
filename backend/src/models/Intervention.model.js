const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'planned' },
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Intervention', interventionSchema);

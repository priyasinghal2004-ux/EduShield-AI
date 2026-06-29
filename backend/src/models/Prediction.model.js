const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  riskScore: { type: Number, required: true },
  riskLabel: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  shapValues: [{
    feature: String,
    value: Number,
    direction: { type: String, enum: ['positive', 'negative'] }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);

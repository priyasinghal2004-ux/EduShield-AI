const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 12 },
  assignedClass: { type: String },
  enrollmentStatus: { type: String, enum: ['enrolled', 'withdrawn', 'graduated'], default: 'enrolled' },
  demographics: {
    age: { type: Number },
    gender: { type: String }
  },
  attendance: {
    totalDays: { type: Number, default: 0 },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    tardy: { type: Number, default: 0 },
    consecutiveAbsences: { type: Number, default: 0 }
  },
  academics: {
    gpa: { type: Number, min: 0, max: 4.0, default: 0 },
    failedCourses: { type: Number, default: 0 },
    currentGrades: [{
      course: String,
      grade: String
    }]
  },
  behavior: {
    disciplinaryIncidents: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    suspensions: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);

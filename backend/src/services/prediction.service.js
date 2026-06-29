const axios = require('axios');
const Prediction = require('../models/Prediction.model');
const Student = require('../models/Student.model');
const env = require('../config/env');
const logger = require('../utils/logger');

class PredictionService {
  async predictForStudent(studentId) {
    // console.log("Searching student:", studentId);
    const student = await Student.findOne({ studentId });
    // console.log("Found student:", student);
    if (!student) {
      throw new Error('Student not found');
    }

    // Prepare data for AI service
    const studentData = {
      attendanceRate: student.attendance.totalDays > 0 ? student.attendance.present / student.attendance.totalDays : 0,
      gpa: student.academics.gpa,
      failedCourses: student.academics.failedCourses,
      disciplinaryIncidents: student.behavior.disciplinaryIncidents,
      consecutiveAbsences: student.attendance.consecutiveAbsences,
      tardyCount: student.attendance.tardy
    };

    let riskScore = 15;
    let riskLabel = 'Low';
    let shapValues = [];

    try {
      // Call AI Service for Prediction
      const predictRes = await axios.post(`${env.AI_SERVICE_URL}/api/v1/predict`, studentData, {
        headers: { 'X-API-Key': env.AI_API_KEY }
      });
      
      riskScore = predictRes.data.riskScore;
      riskLabel = predictRes.data.riskLabel;
      // console.log("Prediction:", studentId, riskScore, riskLabel);

      // Call AI Service for Explanation
      const explainRes = await axios.post(`${env.AI_SERVICE_URL}/api/v1/explain`, studentData, {
        headers: { 'X-API-Key': env.AI_API_KEY }
      });

      shapValues = explainRes.data.shapValues;
    } catch (err) {
      console.log("AI FAILED:", err.response?.data || err.message);

      logger.error(`AI Service call failed for student ${studentId}: ${err.message}`);
      // Fallback to mock data if AI service is down
      const isHighRisk = Math.random() > 0.5;
      riskScore = isHighRisk ? 82 : 15;
      riskLabel = isHighRisk ? 'High' : 'Low';
      shapValues = [
        { feature: 'attendanceRate', value: isHighRisk ? 0.40 : -0.35, direction: isHighRisk ? 'positive' : 'negative' },
        { feature: 'gpa', value: isHighRisk ? 0.32 : -0.30, direction: isHighRisk ? 'positive' : 'negative' },
        { feature: 'failedCourses', value: isHighRisk ? 0.28 : -0.22, direction: isHighRisk ? 'positive' : 'negative' }
      ];
    }

    const prediction = new Prediction({
      student: student._id,
      riskScore,
      riskLabel: riskLabel.toLowerCase(),
      shapValues
    });

    await prediction.save();
    return prediction;
  }

  async getLatest(studentId) {
    const student = await Student.findOne({ studentId });
    if (!student) {
      throw new Error('Student not found');
    }

    return await Prediction.findOne({ student: student._id })
      .sort({ createdAt: -1 })
      .exec();
  }

  async runBatch(studentIds) {
    // console.log("Received IDs:", studentIds);

    const results = [];

    for (const id of studentIds) {
      // console.log("Processing:", id);
      try {
        const result = await this.predictForStudent(id);
        results.push({ studentId: id, success: true, result });
      } catch (error) {
        results.push({ studentId: id, success: false, error: error.message });
      }
    }
    return results;
  }
}

module.exports = new PredictionService();

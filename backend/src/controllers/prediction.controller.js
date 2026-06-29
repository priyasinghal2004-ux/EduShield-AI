const predictionService = require('../services/prediction.service');
const { success } = require('../utils/apiResponse');

class PredictionController {
  async predictForStudent(req, res, next) {
    try {
      const result = await predictionService.predictForStudent(req.params.studentId);
      success(res, result, 'Prediction generated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getLatestPrediction(req, res, next) {
    try {
      const prediction = await predictionService.getLatest(req.params.studentId);
      success(res, prediction, 'Latest prediction retrieved');
    } catch (err) {
      next(err);
    }
  }

  async runBatchPredictions(req, res, next) {
    try {
      const { studentIds } = req.body; // Expecting array of studentIds
      if (!studentIds || !Array.isArray(studentIds)) {
        throw new Error('Invalid input: studentIds must be an array');
      }
      const results = await predictionService.runBatch(studentIds);
      success(res, results, 'Batch predictions completed');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PredictionController();

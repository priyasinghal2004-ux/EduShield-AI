const interventionService = require('../services/intervention.service');
const { success } = require('../utils/apiResponse');

class InterventionController {
  async getInterventionsByStudent(req, res, next) {
    try {
      const interventions = await interventionService.getByStudent(req.params.studentId);
      success(res, interventions, 'Interventions retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createIntervention(req, res, next) {
    try {
      const intervention = await interventionService.create(req.body, req.user._id);
      success(res, intervention, 'Intervention logged successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateIntervention(req, res, next) {
    try {
      const intervention = await interventionService.update(req.params.id, req.body);
      success(res, intervention, 'Intervention updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteIntervention(req, res, next) {
    try {
      await interventionService.delete(req.params.id);
      success(res, null, 'Intervention deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InterventionController();

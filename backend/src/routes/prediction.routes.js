const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);

router.post('/batch', allowRoles('admin'), predictionController.runBatchPredictions);

router.post('/:studentId', predictionController.predictForStudent);

router.get('/:studentId/latest', predictionController.getLatestPrediction);

module.exports = router;

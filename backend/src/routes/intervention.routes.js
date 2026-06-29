const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/intervention.controller');
const validate = require('../middleware/validate.middleware');
const { createInterventionSchema, updateInterventionSchema } = require('../validators/intervention.validator');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(protect);

router.get('/student/:studentId', interventionController.getInterventionsByStudent);
router.post('/', validate(createInterventionSchema), interventionController.createIntervention);
router.put('/:id', validate(updateInterventionSchema), interventionController.updateIntervention);
router.delete('/:id', allowRoles('admin'), interventionController.deleteIntervention);

module.exports = router;

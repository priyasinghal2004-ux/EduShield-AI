const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controllers/student.controller');
const validate = require('../middleware/validate.middleware');
const { createStudentSchema, updateStudentSchema } = require('../validators/student.validator');
const { protect } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

router.post('/', allowRoles('admin'), validate(createStudentSchema), studentController.createStudent);
router.put('/:id', allowRoles('admin'), validate(updateStudentSchema), studentController.updateStudent);
router.post('/import', allowRoles('admin'), upload.single('file'), studentController.importStudents);

module.exports = router;

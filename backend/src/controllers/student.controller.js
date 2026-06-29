const studentService = require('../services/student.service');
const csvImporter = require('../utils/csvImporter');
const { success } = require('../utils/apiResponse');

class StudentController {
  async getAllStudents(req, res, next) {
    try {
      const students = await studentService.getAll(req.query, req.user);
      success(res, students, 'Students retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getStudentById(req, res, next) {
    try {
      const student = await studentService.getById(req.params.id, req.user);
      success(res, student, 'Student retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async createStudent(req, res, next) {
    try {
      const student = await studentService.create(req.body);
      success(res, student, 'Student created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateStudent(req, res, next) {
    try {
      const student = await studentService.update(req.params.id, req.body);
      success(res, student, 'Student updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async importStudents(req, res, next) {
    try {
      if (!req.file) {
        throw new Error('No CSV file uploaded');
      }
      
      const { valid, errors } = csvImporter.parseCSVBuffer(req.file.buffer);
      
      if (valid.length > 0) {
        await studentService.bulkInsert(valid);
      }
      
      success(res, { imported: valid.length, errors }, 'CSV import processed');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();

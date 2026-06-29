const Student = require('../models/Student.model');

class StudentService {
  async getAll(filters = {}, user) {
    // If teacher, only return their assigned class
    if (user.role === 'teacher') {
      filters.assignedClass = user.assignedClass;
    }
    return await Student.find(filters).sort({ lastName: 1, firstName: 1 });
  }

  async getById(id, user) {
    const student = await Student.findOne({ studentId: id });
    if (!student) {
      throw new Error('Student not found');
    }
    if (user.role === 'teacher' && student.assignedClass !== user.assignedClass) {
      throw new Error('Unauthorized access to this student');
    }
    return student;
  }

  async create(data) {
    const exists = await Student.findOne({ studentId: data.studentId });
    if (exists) {
      throw new Error('Student ID already exists');
    }
    const student = new Student(data);
    return await student.save();
  }

  async update(id, data) {
    const student = await Student.findOneAndUpdate(
      { studentId: id },
      data,
      { new: true, runValidators: true }
    );
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async bulkInsert(studentsArray) {
    return await Student.insertMany(studentsArray, { ordered: false });
  }
}

module.exports = new StudentService();

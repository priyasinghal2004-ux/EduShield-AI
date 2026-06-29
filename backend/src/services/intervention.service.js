const Intervention = require('../models/Intervention.model');
const Student = require('../models/Student.model');

class InterventionService {
  async getByStudent(studentId) {
    const student = await Student.findOne({ studentId });
    if (!student) {
      throw new Error('Student not found');
    }
    return await Intervention.find({ student: student._id })
      .populate('loggedBy', 'name role')
      .sort({ createdAt: -1 });
  }

  async create(data, userId) {
    const student = await Student.findOne({ studentId: data.studentId });
    if (!student) {
      throw new Error('Student not found');
    }

    const intervention = new Intervention({
      student: student._id,
      type: data.type,
      description: data.description,
      status: data.status,
      loggedBy: userId
    });

    return await intervention.save();
  }

  async update(id, data) {
    const intervention = await Intervention.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!intervention) {
      throw new Error('Intervention not found');
    }
    return intervention;
  }

  async delete(id) {
    const intervention = await Intervention.findByIdAndDelete(id);
    if (!intervention) {
      throw new Error('Intervention not found');
    }
    return true;
  }
}

module.exports = new InterventionService();

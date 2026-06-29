const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User.model');
const Student = require('./src/models/Student.model');
const { DUMMY_USERS, DUMMY_STUDENTS } = require('../frontend/src/data/dummyData');

mongoose.connect(env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB for seeding...');
    
    await User.deleteMany({});
    await Student.deleteMany({});
    
    // Seed users
    const admin = new User({
      name: 'Dr. Sarah Admin',
      email: 'admin@edushield.ai',
      password: 'admin123',
      role: 'admin'
    });
    const teacher = new User({
      name: 'Maria Flores',
      email: 'teacher@edushield.ai',
      password: 'teacher123',
      role: 'teacher',
      assignedClass: 'Class-A'
    });
    await admin.save();
    await teacher.save();
    
    console.log('Users seeded');

    // Seed students
    // Convert frontend dummy students to backend schema format
    const dbStudents = DUMMY_STUDENTS.map(s => {
      const dbStudent = { ...s };
      delete dbStudent._id; // Let mongoose assign an ObjectId
      delete dbStudent.prediction; // Predictions are stored in their own collection now
      delete dbStudent.interventions; // Interventions are stored in their own collection
      return dbStudent;
    });

    await Student.insertMany(dbStudents);
    console.log('Students seeded');
    
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
